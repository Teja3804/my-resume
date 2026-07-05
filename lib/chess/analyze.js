import { Chess } from "chess.js";

const ANALYSIS_DEPTH = 14;
const MATE_SCORE = 100000;

/** Converts an engine cp/mate score (always from the side-to-move's view) into
 * a signed value from the mover's own perspective, so higher is always better
 * for whoever is about to move in that position. */
function normalize(cp, mate) {
  if (mate !== undefined) {
    return mate > 0 ? MATE_SCORE - mate : -MATE_SCORE - mate;
  }
  return cp;
}

function classify(cpLoss, wasBestMove) {
  if (wasBestMove || cpLoss <= 4) return "best";
  if (cpLoss <= 25) return "excellent";
  if (cpLoss <= 60) return "good";
  if (cpLoss <= 120) return "inaccuracy";
  if (cpLoss <= 250) return "mistake";
  return "blunder";
}

function uciLineToSan(fen, uciMoves, maxLen = 5) {
  const chess = new Chess(fen);
  const sans = [];
  for (const uci of uciMoves.slice(0, maxLen)) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.slice(4, 5) || undefined;
    try {
      const move = chess.move({ from, to, promotion });
      sans.push(move.san);
    } catch {
      break;
    }
  }
  return sans;
}

export async function analyzeGame(engine, history, onProgress) {
  await engine.setStrength({ limitStrength: false, skillLevel: 20 });
  const moves = [];

  for (let i = 0; i < history.length; i++) {
    const record = history[i];
    const before = await engine.goBestMove(record.fenBefore, { depth: ANALYSIS_DEPTH });
    const evalBeforeCp = normalize(before.cp, before.mate);
    const bestMoveUci = before.bestMoveUci ?? "";
    const wasBestMove = bestMoveUci.slice(0, 4) === record.uci.slice(0, 4);

    const after = await engine.goBestMove(record.fenAfter, { depth: ANALYSIS_DEPTH });
    const evalAfterCp = -normalize(after.cp, after.mate);

    const cpLoss = Math.max(0, evalBeforeCp - evalAfterCp);
    const classification = classify(cpLoss, wasBestMove);

    const bestLineSan = uciLineToSan(record.fenBefore, before.pvUci);
    let refutationSan;
    if (!wasBestMove && after.pvUci.length > 0) {
      const [san] = uciLineToSan(record.fenAfter, after.pvUci, 1);
      refutationSan = san;
    }

    moves.push({
      ...record,
      evalBeforeCp,
      evalAfterCp,
      cpLoss,
      classification,
      bestMoveUci,
      bestMoveSan: bestLineSan[0] ?? "",
      bestLineSan,
      refutationSan,
      mateBefore: before.mate,
      mateAfter: after.mate !== undefined ? -after.mate : undefined,
      wasBestMove,
    });

    onProgress?.(i + 1, history.length);
  }

  const accuracy = { w: computeAccuracy(moves, "w"), b: computeAccuracy(moves, "b") };
  const counts = { w: emptyCounts(), b: emptyCounts() };
  for (const m of moves) {
    counts[m.color][m.classification]++;
  }

  return { moves, accuracy, counts };
}

function emptyCounts() {
  return { best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, forced: 0 };
}

/** Estimated accuracy: an exponential decay of average centipawn loss (in
 * pawns). Not identical to any specific site's formula, but monotonic and
 * calibrated so ~0 ACPL is ~100% and ~1 pawn average loss is ~45%. */
function computeAccuracy(moves, color) {
  const sideMoves = moves.filter((m) => m.color === color);
  if (sideMoves.length === 0) return 100;
  const avgLossPawns = sideMoves.reduce((sum, m) => sum + Math.min(m.cpLoss, 1000), 0) / sideMoves.length / 100;
  const acc = 100 * Math.exp(-avgLossPawns / 1.2);
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10));
}
