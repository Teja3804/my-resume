"use client";

import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useStockfishInstance } from "../../lib/chess/useStockfishInstance";
import { analyzeGame } from "../../lib/chess/analyze";
import {
  CLASS_ICON,
  CLASS_LABEL,
  explainBestMove,
  explainMove,
  explainOverall,
  explainVerdict,
  formatEvalCp,
} from "../../lib/chess/explain";

const CLAMP = 600;

function toWhiteCp(m) {
  const cp = m.color === "w" ? m.evalAfterCp : -m.evalAfterCp;
  return Math.max(-CLAMP, Math.min(CLAMP, cp));
}

function EvalGraph({ moves, currentIndex, onSelect }) {
  const width = 100;
  const height = 30;
  const points = moves.map((m, i) => {
    const x = moves.length <= 1 ? 0 : (i / (moves.length - 1)) * width;
    const y = height / 2 - (toWhiteCp(m) / CLAMP) * (height / 2);
    return `${x},${y}`;
  });
  const path = `M0,${height / 2} L${points.join(" L")}`;

  return (
    <div className="chess-eval-graph">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="chess-eval-graph-svg">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} className="chess-eval-graph-zero" />
        <path d={path} className="chess-eval-graph-line" />
        {moves.length > 0 && (
          <circle
            cx={moves.length <= 1 ? 0 : (currentIndex / (moves.length - 1)) * width}
            cy={height / 2 - (toWhiteCp(moves[currentIndex]) / CLAMP) * (height / 2)}
            r="1.8"
            className="chess-eval-graph-cursor"
          />
        )}
      </svg>
      <div className="chess-eval-graph-hit-row">
        {moves.map((_, i) => (
          <button key={i} className="chess-eval-graph-hit" onClick={() => onSelect(i)} aria-label={`Move ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function answerFor(question, move, summary) {
  const q = question.toLowerCase();
  if (!move) return "Select a move from the list first, then ask me about it.";
  if (/(overall|summary|how did i do|accuracy)/.test(q)) return explainOverall(summary);
  if (/(best|should have|better|instead)/.test(q)) return explainBestMove(move);
  if (/(right|wrong|good|bad|correct|mistake|blunder|was (it|that))/.test(q)) return explainVerdict(move);
  if (/(why|explain|reason)/.test(q)) return explainMove(move);
  if (/(hi|hello|hey)/.test(q)) return 'Hi! Ask me things like "was that the best move?" or "what should I have played?"';
  return explainMove(move);
}

const QUICK_PROMPTS = ["Was this the best move?", "Was it right or wrong?", "What should I have played instead?", "How did I do overall?"];

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

function ChatBot({ move, summary }) {
  const [messages, setMessages] = useState([
    { id: nextId(), from: "bot", text: "Pick a move to review, or ask me a question about the game." },
  ]);
  const [input, setInput] = useState("");
  const lastMoveRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!move) return;
    if (lastMoveRef.current === move.ply) return;
    lastMoveRef.current = move.ply;
    setMessages((m) => [...m, { id: nextId(), from: "bot", text: explainMove(move) }]);
  }, [move]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: nextId(), from: "user", text }, { id: nextId(), from: "bot", text: answerFor(text, move, summary) }]);
    setInput("");
  }

  return (
    <div className="chess-chat">
      <h4>Coach</h4>
      <div className="chess-chat-messages" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chess-chat-bubble chess-chat-${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chess-chat-quick">
        {QUICK_PROMPTS.map((p) => (
          <button key={p} type="button" className="chess-chat-quick-btn" onClick={() => send(p)}>
            {p}
          </button>
        ))}
      </div>
      <form
        className="chess-chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about this move…" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function ChessAnalysis({ history, onBack }) {
  const { client, ready } = useStockfishInstance();
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, history.length - 1));

  useEffect(() => {
    if (!ready || !client.current || history.length === 0) return;
    let cancelled = false;
    analyzeGame(client.current, history, (done, total) => {
      if (!cancelled) setProgress(Math.round((done / total) * 100));
    }).then((res) => {
      if (!cancelled) setSummary(res);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (history.length === 0) {
    return (
      <div className="chess-analysis">
        <p>No moves to analyze yet.</p>
        <button type="button" className="chess-actions-btn" onClick={onBack}>
          Back to game
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="chess-analysis chess-analysis-loading">
        <h4>Analyzing game…</h4>
        <div className="chess-progress-bar">
          <div className="chess-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="mono">{progress}%</p>
      </div>
    );
  }

  const current = summary.moves[currentIndex];
  const arrows = [];
  if (!current.wasBestMove && current.bestMoveUci) {
    arrows.push({ startSquare: current.bestMoveUci.slice(0, 2), endSquare: current.bestMoveUci.slice(2, 4), color: "#0f6a70" });
  }
  arrows.push({
    startSquare: current.uci.slice(0, 2),
    endSquare: current.uci.slice(2, 4),
    color: current.wasBestMove ? "#0f6a70" : "#d1583f",
  });

  return (
    <div className="chess-analysis">
      <div className="chess-analysis-main">
        <div className="chess-board-wrap chess-analysis-board">
          <Chessboard
            options={{
              id: "analysis-board",
              position: current.fenAfter,
              boardOrientation: "white",
              allowDragging: false,
              darkSquareStyle: { backgroundColor: "#769656" },
              lightSquareStyle: { backgroundColor: "#eeeed2" },
              arrows,
            }}
          />
        </div>
        <EvalGraph moves={summary.moves} currentIndex={currentIndex} onSelect={setCurrentIndex} />
        <div className="chess-analysis-nav">
          <button type="button" className="chess-actions-btn" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
            ← Prev
          </button>
          <span className="mono">
            Move {currentIndex + 1} / {summary.moves.length}
          </span>
          <button
            type="button"
            className="chess-actions-btn"
            onClick={() => setCurrentIndex((i) => Math.min(summary.moves.length - 1, i + 1))}
            disabled={currentIndex === summary.moves.length - 1}
          >
            Next →
          </button>
        </div>
        <div className="chess-summary-row">
          <div className="chess-summary-side">
            <span>White</span>
            <strong>{summary.accuracy.w}%</strong>
          </div>
          <div className="chess-summary-side">
            <span>Black</span>
            <strong>{summary.accuracy.b}%</strong>
          </div>
        </div>
        <button type="button" className="chess-actions-btn" onClick={onBack}>
          Back to game
        </button>
      </div>

      <div className="chess-analysis-side">
        <div className="chess-move-list">
          {summary.moves.map((m, i) => (
            <button
              key={m.ply}
              type="button"
              className={`chess-move-row chess-cls-${m.classification} ${i === currentIndex ? "selected" : ""}`}
              onClick={() => setCurrentIndex(i)}
            >
              <span className="chess-move-num">
                {Math.floor(m.ply / 2) + 1}
                {m.color === "w" ? "." : "..."}
              </span>
              <span className="chess-move-san">{m.san}</span>
              <span className="chess-move-icon" title={CLASS_LABEL[m.classification]}>
                {CLASS_ICON[m.classification]}
              </span>
              <span className="chess-move-eval">{formatEvalCp(m.evalAfterCp * (m.color === "w" ? 1 : -1))}</span>
            </button>
          ))}
        </div>
        <ChatBot move={current} summary={summary} />
      </div>
    </div>
  );
}
