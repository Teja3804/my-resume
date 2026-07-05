export const CLASS_LABEL = {
  best: "Best move",
  excellent: "Excellent",
  good: "Good",
  inaccuracy: "Inaccuracy",
  mistake: "Mistake",
  blunder: "Blunder",
  forced: "Forced",
};

export const CLASS_ICON = {
  best: "★",
  excellent: "✓",
  good: "✓",
  inaccuracy: "?!",
  mistake: "?",
  blunder: "??",
  forced: "□",
};

export function formatEvalCp(cp, mate) {
  if (mate !== undefined) return mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`;
  const pawns = cp / 100;
  return pawns >= 0 ? `+${pawns.toFixed(2)}` : pawns.toFixed(2);
}

function sideName(color) {
  return color === "w" ? "White" : "Black";
}

export function explainMove(m) {
  const who = sideName(m.color);
  const evalStr = formatEvalCp(m.evalAfterCp, m.mateAfter);

  if (m.wasBestMove) {
    const lead = m.classification === "best" ? "That's the engine's top choice." : "A strong choice.";
    return `${who} played ${m.san} — ${lead} Position is now ${evalStr} for the mover's side. ${
      m.bestLineSan.length > 1 ? `Main point: ${m.bestLineSan.join(" ")}.` : ""
    }`.trim();
  }

  const label = CLASS_LABEL[m.classification];
  const lossStr = (m.cpLoss / 100).toFixed(2);
  let detail = `${who} played ${m.san} — ${label} (loses about ${lossStr} pawns of evaluation compared to the best move).`;
  detail += ` The engine preferred ${m.bestMoveSan}${m.bestLineSan.length > 1 ? ` (${m.bestLineSan.join(" ")})` : ""}.`;
  if (m.refutationSan) {
    detail += ` This lets the opponent continue with ${m.refutationSan}.`;
  }
  if (m.mateBefore && m.mateBefore > 0 && !(m.mateAfter && m.mateAfter > 0)) {
    detail += ` It also throws away a forced mate the mover had (mate in ${m.mateBefore}).`;
  }
  if (m.mateAfter && m.mateAfter < 0) {
    detail += ` Worse — it now allows the opponent to force mate.`;
  }
  return detail;
}

export function explainBestMove(m) {
  if (m.wasBestMove) {
    return `${m.san} was already the engine's recommended move here — nothing better was available.`;
  }
  const line = m.bestLineSan.length > 1 ? ` Likely continuation: ${m.bestLineSan.join(" ")}.` : "";
  return `The engine's preferred move was ${m.bestMoveSan}, keeping the evaluation at ${formatEvalCp(
    m.evalBeforeCp
  )}.${line}`;
}

export function explainVerdict(m) {
  if (m.classification === "best" || m.classification === "excellent") {
    return `Yes — ${m.san} was ${m.wasBestMove ? "the best move in the position" : "an excellent, near-best move"}.`;
  }
  if (m.classification === "good") {
    return `${m.san} was fine — a small, mostly harmless drop in accuracy (${(m.cpLoss / 100).toFixed(2)} pawns).`;
  }
  return `No — ${m.san} was ${CLASS_LABEL[m.classification].toLowerCase()}, costing about ${(m.cpLoss / 100).toFixed(
    2
  )} pawns compared to ${m.bestMoveSan}.`;
}

export function explainOverall(summary) {
  const w = summary.accuracy.w;
  const b = summary.accuracy.b;
  const blunders = summary.counts.w.blunder + summary.counts.b.blunder;
  const mistakes = summary.counts.w.mistake + summary.counts.b.mistake;
  return `White accuracy: ${w}% · Black accuracy: ${b}%. The game had ${blunders} blunder${
    blunders === 1 ? "" : "s"
  } and ${mistakes} mistake${mistakes === 1 ? "" : "s"} combined. Click any move in the list to see what the engine thought at that point.`;
}
