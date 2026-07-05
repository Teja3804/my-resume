"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";

export function useChessGame() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [resignedBy, setResignedBy] = useState(null);
  const [drawAgreed, setDrawAgreed] = useState(false);

  const refresh = useCallback(() => {
    setFen(gameRef.current.fen());
  }, []);

  const applyMove = useCallback(
    (from, to, promotion) => {
      const game = gameRef.current;
      const fenBefore = game.fen();
      try {
        const move = game.move({ from, to, promotion });
        setHistory((h) => [
          ...h,
          {
            ply: h.length + 1,
            color: move.color,
            san: move.san,
            uci: `${move.from}${move.to}${move.promotion ?? ""}`,
            fenBefore,
            fenAfter: game.fen(),
            captured: move.captured,
          },
        ]);
        refresh();
        return true;
      } catch {
        return false;
      }
    },
    [refresh]
  );

  const tryMove = useCallback(
    (from, to) => {
      const game = gameRef.current;
      const verbose = game.moves({ square: from, verbose: true });
      const match = verbose.find((m) => m.to === to);
      if (!match) return false;
      if (match.promotion) {
        setPendingPromotion({ from, to, color: match.color });
        return true;
      }
      return applyMove(from, to);
    },
    [applyMove]
  );

  const resolvePromotion = useCallback(
    (piece) => {
      if (!pendingPromotion) return;
      applyMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, applyMove]
  );

  const cancelPromotion = useCallback(() => setPendingPromotion(null), []);

  const applyUciMove = useCallback(
    (uci) => {
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.slice(4, 5) || undefined;
      return applyMove(from, to, promotion);
    },
    [applyMove]
  );

  const reset = useCallback(
    (startFen) => {
      gameRef.current = startFen ? new Chess(startFen) : new Chess();
      setHistory([]);
      setResignedBy(null);
      setDrawAgreed(false);
      refresh();
    },
    [refresh]
  );

  const resign = useCallback((color) => setResignedBy(color), []);
  const agreeDraw = useCallback(() => setDrawAgreed(true), []);

  const legalMovesFrom = useCallback((square) => {
    return gameRef.current.moves({ square, verbose: true });
  }, []);

  const result = useMemo(() => {
    const game = gameRef.current;
    if (resignedBy) {
      return { over: true, winner: resignedBy === "w" ? "b" : "w", reason: "resignation" };
    }
    if (drawAgreed) {
      return { over: true, winner: "draw", reason: "draw-agreed" };
    }
    if (game.isCheckmate()) {
      return { over: true, winner: game.turn() === "w" ? "b" : "w", reason: "checkmate" };
    }
    if (game.isStalemate()) return { over: true, winner: "draw", reason: "stalemate" };
    if (game.isInsufficientMaterial()) return { over: true, winner: "draw", reason: "insufficient" };
    if (game.isThreefoldRepetition()) return { over: true, winner: "draw", reason: "repetition" };
    if (game.isDrawByFiftyMoves()) return { over: true, winner: "draw", reason: "fifty-move" };
    return { over: false, winner: null, reason: null };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, resignedBy, drawAgreed]);

  return {
    game: gameRef.current,
    fen,
    history,
    turn: gameRef.current.turn(),
    inCheck: gameRef.current.isCheck(),
    pendingPromotion,
    result,
    tryMove,
    applyUciMove,
    resolvePromotion,
    cancelPromotion,
    legalMovesFrom,
    reset,
    resign,
    agreeDraw,
  };
}
