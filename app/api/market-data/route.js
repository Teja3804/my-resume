import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTickers = new Set(["MSFT", "GOOG", "AAPL", "BAC", "NVDA"]);
const optionsRangePoints = 30;
const tradingDays = 252;
const twoMonthsMs = 60 * 24 * 60 * 60 * 1000;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"]
});

function buildStrikeAxis(centerPrice) {
  const lower = Math.floor(centerPrice - optionsRangePoints);
  const upper = Math.ceil(centerPrice + optionsRangePoints);
  const strikes = [];
  for (let strike = lower; strike <= upper; strike += 1) {
    strikes.push(strike);
  }
  return strikes;
}

function formatOptionDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function computeDriftAndVolatility(closes) {
  const returns = [];
  for (let i = 1; i < closes.length; i += 1) {
    returns.push(Math.log(closes[i] / closes[i - 1]));
  }

  const mean =
    returns.reduce((accumulator, current) => accumulator + current, 0) / Math.max(returns.length, 1);
  const variance =
    returns.reduce((accumulator, current) => accumulator + (current - mean) ** 2, 0) /
    Math.max(returns.length - 1, 1);

  return {
    annualDrift: mean * tradingDays,
    annualVolatility: Math.sqrt(Math.max(variance, 0)) * Math.sqrt(tradingDays)
  };
}

function buildSyntheticSurface(strikes, expiryLabels, spotPrice) {
  return expiryLabels.map((_, expiryIndex) =>
    strikes.map((strike) => {
      const distance = Math.abs(strike - spotPrice);
      const decay = Math.exp(-distance / 10);
      const expiryFactor = 1 + expiryIndex * 0.12;
      const noise = 0.72 + Math.random() * 0.6;
      return Math.max(0, Math.round(1800 * decay * expiryFactor * noise));
    })
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = (searchParams.get("ticker") || "").trim().toUpperCase();

    if (!allowedTickers.has(ticker)) {
      return NextResponse.json(
        { success: false, error: "Unsupported ticker." },
        { status: 400 }
      );
    }

    const period2 = new Date();
    const period1 = new Date(Date.now() - 370 * 24 * 60 * 60 * 1000);
    const chart = await yahooFinance.chart(ticker, {
      period1,
      period2,
      interval: "1d"
    });

    const closes = (chart?.quotes || [])
      .map((quote) => quote?.close)
      .filter((value) => Number.isFinite(value) && value > 0);

    if (closes.length < 30) {
      throw new Error("Not enough historical data to compute simulation parameters.");
    }

    const spotPrice = Number(chart?.meta?.regularMarketPrice) || closes[closes.length - 1];
    const { annualDrift, annualVolatility } = computeDriftAndVolatility(closes);

    const rootOptions = await yahooFinance.options(ticker);
    const rawExpiries = (rootOptions?.expirationDates || []).filter(Boolean);
    const now = Date.now();

    let expiries = rawExpiries
      .filter((date) => date.getTime() >= now && date.getTime() <= now + twoMonthsMs)
      .slice(0, 8);
    if (!expiries.length) {
      expiries = rawExpiries.slice(0, 6);
    }
    if (!expiries.length) {
      throw new Error("No option expiries available from Yahoo.");
    }

    const strikes = buildStrikeAxis(spotPrice);
    const lowerStrike = strikes[0];
    const upperStrike = strikes[strikes.length - 1];
    const expiryLabels = [];
    const volumeSurface = [];

    for (let expiryIndex = 0; expiryIndex < expiries.length; expiryIndex += 1) {
      const expiry = expiries[expiryIndex];
      const optionChain =
        expiryIndex === 0 ? rootOptions : await yahooFinance.options(ticker, { date: expiry });
      const optionData = optionChain?.options?.[0];

      const row = new Array(strikes.length).fill(0);
      const calls = optionData?.calls || [];
      const puts = optionData?.puts || [];

      [...calls, ...puts].forEach((contract) => {
        const strike = Math.round(contract?.strike);
        if (!Number.isFinite(strike) || strike < lowerStrike || strike > upperStrike) return;
        const volume = Number.isFinite(contract?.volume)
          ? contract.volume
          : Number(contract?.openInterest || 0);
        row[strike - lowerStrike] += Math.max(0, volume);
      });

      expiryLabels.push(formatOptionDate(expiry));
      volumeSurface.push(row);
    }

    let finalizedSurface = volumeSurface;
    const hasVolume = volumeSurface.some((row) => row.some((value) => value > 0));
    if (!hasVolume) {
      finalizedSurface = buildSyntheticSurface(strikes, expiryLabels, spotPrice);
    }

    let finalizedLabels = [...expiryLabels];
    if (finalizedSurface.length === 1) {
      finalizedSurface.push([...finalizedSurface[0]]);
      finalizedLabels.push(`${finalizedLabels[0]} +`);
    }

    return NextResponse.json({
      success: true,
      ticker,
      spotPrice,
      annualDrift,
      annualVolatility,
      strikes,
      expiryLabels: finalizedLabels,
      volumeSurface: finalizedSurface
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to load market data."
      },
      { status: 500 }
    );
  }
}
