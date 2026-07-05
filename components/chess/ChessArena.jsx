"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useChessGame } from "../../lib/chess/useChessGame";
import { useStockfishInstance } from "../../lib/chess/useStockfishInstance";
import { DEFAULT_RATING, OPPONENT_RATINGS, ratingLabel, strengthForRating } from "../../lib/chess/ratings";
import ChessAnalysis from "./ChessAnalysis";

const REASON_LABEL = {
  checkmate: "Checkmate",
  stalemate: "Stalemate",
  insufficient: "Draw — insufficient material",
  repetition: "Draw — threefold repetition",
  "fifty-move": "Draw — fifty-move rule",
  resignation: "Resignation",
  "draw-agreed": "Draw agreed",
};

const PROMOTION_GLYPH = {
  q: { w: "♕", b: "♛" },
  r: { w: "♖", b: "♜" },
  b: { w: "♗", b: "♝" },
  n: { w: "♘", b: "♞" },
};

function statusText(chess, thinking) {
  if (chess.result.over) {
    if (chess.result.winner === "draw") return `Draw — ${REASON_LABEL[chess.result.reason] ?? ""}`;
    const winner = chess.result.winner === "w" ? "White" : "Black";
    return `${winner} wins — ${REASON_LABEL[chess.result.reason] ?? ""}`;
  }
  if (thinking) return "Computer is thinking…";
  return chess.turn === "w" ? "Your move (White)." : "Computer to move (Black).";
}

export default function ChessArena({ isOpen, onClose }) {
  const chess = useChessGame();
  const { client, ready } = useStockfishInstance();
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [selected, setSelected] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [view, setView] = useState("play");
  const strengthAppliedRef = useRef(null);

  // Apply the chosen strength whenever it changes (and once the engine is ready).
  useEffect(() => {
    if (!ready || !client.current) return;
    if (strengthAppliedRef.current === rating) return;
    strengthAppliedRef.current = rating;
    client.current.setStrength(strengthForRating(rating));
  }, [ready, rating, client]);

  // Computer move loop: whenever it's Black's turn, ask the engine to move.
  useEffect(() => {
    if (!ready || !client.current) return;
    if (chess.result.over || chess.pendingPromotion) return;
    if (chess.turn === "b") {
      setThinking(true);
      const strength = strengthForRating(rating);
      client.current
        .goBestMove(chess.fen, { moveTimeMs: strength.moveTimeMs })
        .then((res) => {
          if (res.bestMoveUci) chess.applyUciMove(res.bestMoveUci);
        })
        .finally(() => setThinking(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chess.fen, ready, chess.result.over, chess.pendingPromotion]);

  useEffect(() => {
    if (!isOpen) {
      setView("play");
    }
  }, [isOpen]);

  const humanCanMove = !chess.result.over && !thinking && !chess.pendingPromotion && chess.turn === "w";
  const legalTargets = selected && !chess.result.over ? chess.legalMovesFrom(selected).map((m) => m.to) : [];
  const lastMove = chess.history.at(-1);

  const squareStyles = {};
  if (lastMove) {
    squareStyles[lastMove.uci.slice(0, 2)] = { background: "rgba(244, 93, 47, 0.28)" };
    squareStyles[lastMove.uci.slice(2, 4)] = { background: "rgba(244, 93, 47, 0.28)" };
  }
  if (selected) {
    squareStyles[selected] = { background: "rgba(15, 106, 112, 0.35)" };
  }
  for (const target of legalTargets) {
    squareStyles[target] = {
      backgroundImage: "radial-gradient(circle, rgba(20,20,20,0.35) 22%, transparent 26%)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  function handleSquareClick({ square }) {
    if (!humanCanMove) return;
    const piece = chess.game.get(square);
    if (selected) {
      if (square === selected) {
        setSelected(null);
        return;
      }
      const moved = chess.tryMove(selected, square);
      setSelected(moved ? null : piece && piece.color === "w" ? square : null);
      return;
    }
    if (piece && piece.color === "w") setSelected(square);
  }

  function handleDrop({ sourceSquare, targetSquare }) {
    if (!humanCanMove || !targetSquare) return false;
    const moved = chess.tryMove(sourceSquare, targetSquare);
    if (moved) setSelected(null);
    return moved;
  }

  function newGame() {
    chess.reset();
    setSelected(null);
    setView("play");
    client.current?.send("ucinewgame");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={`modal-box chess-box ${view === "analysis" ? "chess-box-wide" : ""}`}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <p className="modal-kicker mono">Human vs Computer</p>
                <h3 className="modal-title">Chess Arena</h3>
              </div>
              <button type="button" className="modal-close" onClick={onClose}>
                ✕
              </button>
            </div>

            {view === "analysis" ? (
              <ChessAnalysis history={chess.history} onBack={() => setView("play")} />
            ) : (
              <>
                <div className="chess-rating-row">
                  <span className="chess-rating-label mono">Opponent rating</span>
                  <div className="chess-rating-chips">
                    {OPPONENT_RATINGS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`chess-rating-chip ${rating === r ? "active" : ""}`}
                        onClick={() => setRating(r)}
                        title={ratingLabel(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chess-layout">
                  <div className="chess-board-wrap">
                    <Chessboard
                      options={{
                        id: "main-board",
                        position: chess.fen,
                        boardOrientation: "white",
                        allowDragging: humanCanMove,
                        animationDurationInMs: 180,
                        darkSquareStyle: { backgroundColor: "#769656" },
                        lightSquareStyle: { backgroundColor: "#eeeed2" },
                        squareStyles,
                        onPieceDrop: handleDrop,
                        onSquareClick: handleSquareClick,
                      }}
                    />
                    {chess.pendingPromotion && (
                      <div className="chess-promotion-overlay">
                        <div className="chess-promotion-card">
                          <p>Promote to</p>
                          <div className="chess-promotion-options">
                            {["q", "r", "b", "n"].map((p) => (
                              <button key={p} type="button" onClick={() => chess.resolvePromotion(p)}>
                                {PROMOTION_GLYPH[p][chess.pendingPromotion.color]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="chess-side">
                    <p className="chess-status">{statusText(chess, thinking)}</p>
                    <p className="chess-engine mono">{ready ? `✓ Stockfish · ${ratingLabel(rating)}` : "Loading engine…"}</p>
                    {thinking && <p className="chess-thinking mono">Engine thinking…</p>}
                    <div className="chess-actions">
                      <button type="button" onClick={newGame}>
                        New Game
                      </button>
                      <button type="button" onClick={() => chess.resign("w")} disabled={chess.result.over}>
                        Resign
                      </button>
                    </div>
                    {chess.result.over && (
                      <div className="chess-actions">
                        <button type="button" className="chess-analyze-btn" onClick={() => setView("analysis")}>
                          Analyze Game
                        </button>
                      </div>
                    )}
                    <div className="chess-history">
                      <h4>Move History</h4>
                      <p className="mono">{chess.history.length ? chess.history.map((m) => m.san).join(" ") : "No moves yet."}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
