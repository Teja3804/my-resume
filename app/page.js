"use client";

import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Chessboard } from "react-chessboard";
import { useEffect, useMemo, useRef, useState } from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

/* ─── Nav ──────────────────────────────────────────────────────────── */
const navLinks = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

/* ─── Hero metrics ─────────────────────────────────────────────────── */
const metrics = [
  { value: "8+", label: "Projects shipped across AI, finance & systems" },
  { value: "1", label: "Industry role in financial services" },
  { value: "4", label: "Domains: AI/ML · Finance · Backend · Healthcare" },
];

/* ─── Projects ─────────────────────────────────────────────────────── */
const projectData = [
  {
    id: "llm-finetune",
    title: "LLM Fine-Tuning Pipeline",
    status: "Shipped",
    tag: "AI / ML",
    accent: "#7c3aed",
    summary:
      "End-to-end pipeline for domain-adaptive fine-tuning of large language models using LoRA and QLoRA with automated training monitoring and experiment tracking via Weights & Biases.",
    stack: ["PyTorch", "Transformers", "LoRA", "CUDA", "Python", "W&B"],
    impact:
      "Achieved 3× inference speed improvement via post-training quantization with under 2% accuracy loss on domain-specific benchmarks.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }],
    demoType: "llm",
  },
  {
    id: "rag-engine",
    title: "RAG Knowledge Retrieval Engine",
    status: "Shipped",
    tag: "AI / LLM",
    accent: "#0891b2",
    summary:
      "Retrieval-augmented generation system for enterprise document Q&A with hybrid vector + BM25 keyword search and cross-encoder re-ranking for precision at scale.",
    stack: ["LangChain", "FAISS", "FastAPI", "Python", "Sentence Transformers"],
    impact:
      "Indexed 50K+ documents with sub-200ms retrieval latency, deployed as a containerized REST microservice with async request batching.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }],
    demoType: "rag",
  },
  {
    id: "ml-api",
    title: "ML Inference Microservice",
    status: "Shipped",
    tag: "Backend / MLOps",
    accent: "#16a34a",
    summary:
      "High-throughput FastAPI service for serving ML models with async request batching, Redis response caching, health probes, and Docker-based zero-downtime blue-green deployment.",
    stack: ["FastAPI", "Docker", "Redis", "Pydantic", "Python", "CI/CD"],
    impact:
      "Handles 1,200+ req/sec with p99 latency under 45ms. Deployed via GitHub Actions with automatic rollback on health check failure.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }],
    demoType: "api",
  },
  {
    id: "quant-predictor",
    title: "QuantML Price Predictor",
    status: "Shipped",
    tag: "Finance / ML",
    accent: "#d97706",
    summary:
      "LSTM-based multi-step price prediction engine trained on 14 technical indicators with walk-forward backtesting and Monte Carlo confidence intervals.",
    stack: ["PyTorch", "LSTM", "Pandas", "NumPy", "Python", "TA-Lib"],
    impact:
      "61% directional accuracy on held-out test data, integrated into live trading dashboard with dynamic position sizing recommendations.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }],
    demoType: "quant",
  },
  {
    id: "investment-platform",
    title: "Selected Stocks Investment Platform",
    status: "Shipped",
    tag: "Finance",
    accent: "#0f6a70",
    summary:
      "Portfolio tracking and performance analytics platform with a practical data layer for investment decision support and automated risk management.",
    stack: ["Python", "SQL", "JavaScript", "Analytics"],
    impact:
      "Designed for day-to-day portfolio visibility with automated P&L breakdowns and multi-asset correlation matrix reports.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/TheInterstingGame" }],
  },
  {
    id: "chess",
    title: "Interactive Chess Application",
    status: "Shipped",
    tag: "Frontend",
    accent: "#f45d2f",
    summary:
      "A polished browser chess experience with Stockfish AI integration, clean move validation, highlighted legal moves, and a responsive layout across all screen sizes.",
    stack: ["JavaScript", "HTML", "CSS", "chess.js", "Stockfish"],
    impact:
      "Demonstrates frontend state management, event-driven architecture, and real-time game logic with AI opponent fallback.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/chesssunreddy" }],
    demoType: "chess",
  },
  {
    id: "patient-portal",
    title: "Patient Portal Management System",
    status: "In Progress",
    tag: "Healthcare",
    accent: "#0f6a70",
    summary:
      "Healthcare workflow platform for appointments, doctor-patient messaging, and structured medical records with role-based access control and HIPAA-aligned data handling.",
    stack: ["Python", "SQL", "JavaScript", "FastAPI"],
    impact:
      "Aims to reduce care coordination friction with structured intake flows and secure patient-provider communication.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }],
  },
  {
    id: "algo-trading",
    title: "Algorithmic Trading Strategy Platform",
    status: "In Progress",
    tag: "Finance / Quant",
    accent: "#b45309",
    summary:
      "Strategy execution workspace with live market analytics, Monte Carlo simulation, 3D options surface visualizations, and automation-oriented backtesting architecture.",
    stack: ["Python", "NumPy", "Plotly", "Options Pricing", "Automation"],
    impact:
      "Focused on repeatable strategy experimentation with real Yahoo Finance data and Brownian motion path modeling.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/BrowmianSimulation" }],
    demoType: "trading",
  },
];

const stockUniverse = [
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "GOOG", name: "Google" },
  { ticker: "AAPL", name: "Apple" },
  { ticker: "BAC", name: "Bank of America" },
  { ticker: "NVDA", name: "NVIDIA" },
];

const STOCKFISH_URL = "https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js";
const BROWNIAN_PATHS = 10000;
const BROWNIAN_YEARS = 1;
const TRADING_DAYS = 252;
const OPTIONS_RANGE = 30;

/* ─── Experience ─────────────────────────────────────────────────────── */
const experienceData = [
  {
    role: "Software Developer",
    organization: "Capri Global Capital",
    period: "2022 – 2023",
    location: "India",
    domain: "Financial Services",
    highlights: [
      "Developed and maintained software features for financial workflows and operational systems.",
      "Collaborated with cross-functional teams to deliver stable, production-ready feature releases.",
      "Contributed to backend API integration, data pipeline optimizations, and application performance improvements.",
    ],
    tools: ["Python", "SQL", "JavaScript", "API Integration", "Performance Optimization"],
  },
];

/* ─── Skills ─────────────────────────────────────────────────────────── */
const skillGroups = [
  {
    idx: "01",
    title: "AI & Machine Learning",
    summary: "Building intelligent systems from data pipeline to production deployment.",
    items: ["PyTorch", "Transformers", "LangChain", "FAISS", "LoRA / QLoRA", "LSTM / RNN", "scikit-learn", "Weights & Biases"],
  },
  {
    idx: "02",
    title: "Frontend Engineering",
    summary: "Building responsive, fast, and polished user interfaces.",
    items: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Framer Motion", "Tailwind CSS"],
  },
  {
    idx: "03",
    title: "Backend & API Engineering",
    summary: "Designing service layers and robust integration workflows.",
    items: ["Python", "FastAPI", "Node.js", "Express.js", "REST API Design", "Redis", "Docker", "CI/CD"],
  },
  {
    idx: "04",
    title: "Data & Database Systems",
    summary: "Structuring data models and analytics pipelines for product decisions.",
    items: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Pandas", "NumPy", "Data Modeling", "Performance Analytics"],
  },
  {
    idx: "05",
    title: "Developer Tools & Delivery",
    summary: "Shipping production-ready software with modern tooling.",
    items: ["Git & GitHub", "Docker", "CI/CD Pipelines", "Linux", "Postman", "Unit Testing", "Integration Testing", "Agile"],
  },
];

const technologyStack = [
  "PyTorch", "Transformers", "LangChain", "FAISS", "LoRA", "CUDA",
  "React.js", "Next.js", "JavaScript", "TypeScript", "Framer Motion",
  "Python", "FastAPI", "Node.js", "Express.js", "Redis", "Docker",
  "SQL", "PostgreSQL", "MongoDB", "Pandas", "NumPy",
  "Git", "CI/CD", "Linux", "Postman", "Agile", "System Design",
];

/* ─── Education ──────────────────────────────────────────────────────── */
const education = [
  {
    degree: "Master of Information Systems",
    institution: "Saint Louis University, Saint Louis, Missouri",
    details:
      "Advanced coursework in information systems, software engineering, and business-aligned technical problem solving.",
  },
];

const statusFilters = [
  { value: "all", label: "All Projects" },
  { value: "shipped", label: "Shipped" },
  { value: "in progress", label: "In Progress" },
];

const marqueeText =
  "PYTORCH  LANGCHAIN  TRANSFORMERS  FAISS  FASTAPI  NEXT.JS  SQL  DOCKER  FINTECH  AI/ML SYSTEMS  DISTRIBUTED INFERENCE  ALGORITHMIC TRADING  HEALTHCARE SYSTEMS  ";

/* ─── Animation variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }),
};

/* ─── Utilities ──────────────────────────────────────────────────────── */
function pickRandomTicker(prev = "") {
  const pool = stockUniverse.filter((s) => s.ticker !== prev);
  return pool[Math.floor(Math.random() * pool.length)].ticker;
}

function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function toUsd(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function parseStockfishBestMove(line) {
  if (!line?.startsWith("bestmove ")) return null;
  const parts = line.trim().split(/\s+/);
  return parts.length >= 2 && parts[1] !== "(none)" ? parts[1] : null;
}

/* ─── Chess AI: Minimax with alpha-beta pruning ───────────────────────── */
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function evalBoard(game) {
  if (game.isCheckmate()) return game.turn() === "b" ? 100000 : -100000;
  if (game.isDraw()) return 0;
  let score = 0;
  for (const row of game.board()) {
    for (const sq of row) {
      if (!sq) continue;
      score += (sq.color === "w" ? 1 : -1) * (PIECE_VALUES[sq.type] ?? 0);
    }
  }
  return score;
}

function minimaxAB(game, depth, alpha, beta, maximizing) {
  if (depth === 0 || game.isGameOver()) return evalBoard(game);
  const moves = game.moves();
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      game.move(m);
      const v = minimaxAB(game, depth - 1, alpha, beta, false);
      game.undo();
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    game.move(m);
    const v = minimaxAB(game, depth - 1, alpha, beta, true);
    game.undo();
    if (v < best) best = v;
    if (v < beta) beta = v;
    if (beta <= alpha) break;
  }
  return best;
}

function getMinimaxMove(game) {
  const moves = game.moves({ verbose: true });
  if (!moves.length) return null;
  let bestScore = Infinity, bestMove = moves[0];
  for (const m of moves) {
    game.move(m);
    const score = minimaxAB(game, 2, -Infinity, Infinity, true);
    game.undo();
    if (score < bestScore) { bestScore = score; bestMove = m; }
  }
  return bestMove;
}

function getChessStatus(game, thinking) {
  if (game.isCheckmate()) return game.turn() === "w" ? "Checkmate — Computer wins." : "Checkmate — You win! 🎉";
  if (game.isDraw()) return "Draw. Start a new game.";
  if (thinking) return "Computer is thinking…";
  return game.turn() === "w" ? "Your move (White)." : "Computer to move (Black).";
}

/* ─── Brownian canvas ─────────────────────────────────────────────────── */
function drawBrownian(canvas, startPrice, drift, vol) {
  if (!canvas || !Number.isFinite(startPrice)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(600, canvas.clientWidth || 720);
  const h = Math.max(260, canvas.clientHeight || 300);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#08192a"); bg.addColorStop(1, "#0c2438");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const y = (h / 6) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  const dt = BROWNIAN_YEARS / TRADING_DAYS;
  const sv = Math.max(vol, 0.12);
  const minP = Math.max(0.01, startPrice * Math.exp((drift - 0.5 * sv * sv) * BROWNIAN_YEARS - 4 * sv));
  const maxP = startPrice * Math.exp((drift - 0.5 * sv * sv) * BROWNIAN_YEARS + 4 * sv);
  const span = Math.max(maxP - minP, 0.01);
  const toY = (p) => h - ((p - minP) / span) * h;

  ctx.strokeStyle = "rgba(72,205,188,0.04)"; ctx.lineWidth = 0.5;
  for (let i = 0; i < BROWNIAN_PATHS; i++) {
    let p = startPrice;
    ctx.beginPath(); ctx.moveTo(0, toY(p));
    for (let t = 1; t <= TRADING_DAYS; t++) {
      p *= Math.exp((drift - 0.5 * sv * sv) * dt + sv * Math.sqrt(dt) * gaussianRandom());
      ctx.lineTo((t / TRADING_DAYS) * w, toY(p));
    }
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,198,109,0.95)"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let t = 0; t <= TRADING_DAYS; t++) {
    const ep = startPrice * Math.exp(drift * t * dt);
    t === 0 ? ctx.moveTo(0, toY(ep)) : ctx.lineTo((t / TRADING_DAYS) * w, toY(ep));
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(232,244,255,0.7)"; ctx.font = "11px monospace";
  ctx.fillText("Expected Path", 12, 20);
  ctx.fillText(`${BROWNIAN_PATHS.toLocaleString()} simulated paths`, 12, 36);
}

/* ─── QuantML canvas ──────────────────────────────────────────────────── */
function drawQuantChart(canvas, seed = 1) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(460, canvas.clientWidth || 560);
  const h = Math.max(220, canvas.clientHeight || 260);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#050e1a"; ctx.fillRect(0, 0, w, h);

  const rng = (n) => { const x = Math.sin(n * seed * 9.74 + 1.7) * 43758.5453; return x - Math.floor(x); };
  const days = 60, fc = 10;
  const px = [90 + rng(0) * 30];
  for (let i = 1; i < days; i++) px.push(px[i - 1] * (1 + (rng(i) - 0.49) * 0.025));

  const pd = px.map((p, i) => i === 0 ? p : p * (1 + (rng(i + 200) - 0.5) * 0.004));

  let lp = px[px.length - 1];
  const fc_px = [lp];
  for (let i = 1; i <= fc; i++) { lp *= (1 + (rng(days + i) - 0.47) * 0.022); fc_px.push(lp); }

  const all = [...px, ...fc_px.slice(1)];
  const minP = Math.min(...all) * 0.97, maxP = Math.max(...all) * 1.03;
  const span = maxP - minP;
  const pad = { t: 32, r: 16, b: 28, l: 46 };
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
  const total = days + fc - 1;
  const xOf = (i) => pad.l + (i / total) * cw;
  const yOf = (p) => pad.t + ch - ((p - minP) / span) * ch;

  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = pad.t + (ch / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
    ctx.fillStyle = "rgba(180,210,255,0.35)"; ctx.font = "9px monospace";
    ctx.fillText((maxP - (span / 4) * i).toFixed(0), 2, y + 4);
  }

  ctx.strokeStyle = "rgba(130,210,255,0.85)"; ctx.lineWidth = 1.5;
  ctx.beginPath();
  px.forEach((p, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(p)) : ctx.lineTo(xOf(i), yOf(p)));
  ctx.stroke();

  ctx.strokeStyle = "rgba(80,220,140,0.9)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 2]);
  ctx.beginPath();
  pd.forEach((p, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(p)) : ctx.lineTo(xOf(i), yOf(p)));
  ctx.stroke(); ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(255,200,70,0.9)"; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
  ctx.beginPath();
  fc_px.forEach((p, i) => { const xi = days - 1 + i; i === 0 ? ctx.moveTo(xOf(xi), yOf(p)) : ctx.lineTo(xOf(xi), yOf(p)); });
  ctx.stroke(); ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,200,70,0.07)";
  ctx.beginPath();
  fc_px.forEach((p, i) => { const xi = days - 1 + i; const sp = p * 0.013 * Math.sqrt(i + 1); i === 0 ? ctx.moveTo(xOf(xi), yOf(p + sp)) : ctx.lineTo(xOf(xi), yOf(p + sp)); });
  for (let i = fc; i >= 0; i--) { const p = fc_px[i]; const xi = days - 1 + i; const sp = p * 0.013 * Math.sqrt(i + 1); ctx.lineTo(xOf(xi), yOf(p - sp)); }
  ctx.closePath(); ctx.fill();

  ctx.strokeStyle = "rgba(255,200,70,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xOf(days - 1), pad.t); ctx.lineTo(xOf(days - 1), pad.t + ch); ctx.stroke(); ctx.setLineDash([]);

  const lx = pad.l + 4;
  ctx.font = "10px monospace";
  ctx.fillStyle = "rgba(130,210,255,0.8)"; ctx.fillText("Actual", lx, pad.t + 14);
  ctx.fillStyle = "rgba(80,220,140,0.8)"; ctx.fillText("LSTM Predicted", lx + 56, pad.t + 14);
  ctx.fillStyle = "rgba(255,200,70,0.9)"; ctx.fillText("10-Day Forecast", lx + 180, pad.t + 14);
}

/* ─── LLM training canvas animation ──────────────────────────────────── */
function useLLMTraining(canvasRef, active) {
  const animRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!active) { if (animRef.current) cancelAnimationFrame(animRef.current); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    stepRef.current = 0;
    const totalSteps = 100;
    const tl = (t) => 3.5 * Math.exp(-t * 0.033) + 0.82 + Math.sin(t * 0.75) * 0.055 * Math.exp(-t * 0.055);
    const vl = (t) => 3.5 * Math.exp(-t * 0.027) + 0.97 + Math.sin(t * 0.65 + 1.2) * 0.075 * Math.exp(-t * 0.04);

    const tick = () => {
      const step = stepRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(380, canvas.clientWidth || 480);
      const h = Math.max(190, canvas.clientHeight || 230);
      if (canvas.width !== Math.floor(w * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.fillStyle = "#050e1a"; ctx.fillRect(0, 0, w, h);

      const pad = { t: 30, r: 16, b: 32, l: 40 };
      const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
      const xOf = (i) => pad.l + (i / totalSteps) * cw;
      const yOf = (v) => pad.t + ch - ((Math.max(0, 3.8 - v)) / 3.2) * ch;

      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.t + (ch / 4) * i;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
        ctx.fillStyle = "rgba(160,200,255,0.35)"; ctx.font = "9px monospace";
        ctx.fillText((3.8 - (3.2 / 4) * i).toFixed(1), 2, y + 4);
      }
      ctx.fillStyle = "rgba(160,200,255,0.3)"; ctx.font = "9px monospace";
      ctx.fillText("Epoch", pad.l + cw / 2 - 14, h - 4);

      ctx.strokeStyle = "rgba(100,195,255,0.9)"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= step && i <= totalSteps; i++) {
        const x = xOf(i), y = yOf(tl(i));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,145,80,0.85)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 2]);
      ctx.beginPath();
      for (let i = 0; i <= step && i <= totalSteps; i++) {
        const x = xOf(i), y = yOf(vl(i));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.setLineDash([]);

      if (step > 0) {
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "rgba(100,195,255,0.9)"; ctx.fillText(`Train: ${tl(step).toFixed(4)}`, pad.l + 4, pad.t + 14);
        ctx.fillStyle = "rgba(255,145,80,0.9)"; ctx.fillText(`Val: ${vl(step).toFixed(4)}`, pad.l + 132, pad.t + 14);
        ctx.fillStyle = "rgba(170,220,175,0.65)"; ctx.fillText(`Epoch ${step}/${totalSteps}`, xOf(cw) - 70, pad.t + 14);
      }

      if (step < totalSteps) { stepRef.current++; animRef.current = requestAnimationFrame(tick); }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active, canvasRef]);
}

/* ─── RAG demo data ─────────────────────────────────────────────────── */
const RAG_QUERIES = [
  "How does the fine-tuning pipeline handle catastrophic forgetting?",
  "What retrieval strategy does the RAG engine use?",
  "How is the ML inference service scaled for high throughput?",
  "Describe the backtesting methodology for QuantML.",
];

const RAG_DATA = [
  {
    chunks: [
      "LoRA adapters freeze original model weights and only train low-rank decomposition matrices, preserving pretrained knowledge entirely.",
      "Gradient checkpointing and cosine annealing schedules stabilize training and reduce loss variance across domain shifts.",
      "Post-training QLoRA quantization reduces model footprint by 4× with negligible accuracy degradation on domain benchmarks.",
    ],
    answer: "Catastrophic forgetting is mitigated via LoRA/QLoRA adapters that freeze base weights entirely. Combined with conservative learning rates, gradient clipping, and validation-based early stopping, the pipeline maintains general language capability while adapting to domain-specific vocabulary and reasoning patterns.",
  },
  {
    chunks: [
      "Hybrid search combines dense FAISS vector retrieval using sentence embeddings with sparse BM25 keyword matching for complementary recall.",
      "A cross-encoder re-ranker scores the top-20 retrieved passages for semantic relevance, improving precision from 74% to 89% in evaluation.",
      "Chunking strategy uses 512-token windows with 64-token overlap to preserve cross-chunk context for long-form documents.",
    ],
    answer: "The RAG engine uses two-stage retrieval: FAISS vector search retrieves 20 candidate chunks; a cross-encoder re-ranker then selects the top 5 by semantic relevance. This hybrid approach achieves sub-200ms end-to-end latency while significantly improving answer precision over naive vector-only retrieval.",
  },
  {
    chunks: [
      "FastAPI async endpoints handle concurrent requests without blocking, leveraging Python's asyncio event loop for I/O-bound workloads.",
      "Redis caching stores inference results keyed by input hash with a 5-minute TTL, reducing redundant model calls by approximately 40%.",
      "Dynamic request batching groups concurrent same-shape inputs before forwarding to the model, improving GPU utilization by 2–3×.",
    ],
    answer: "The service scales through three complementary mechanisms: async FastAPI handlers for concurrent I/O, Redis response caching for repeated queries, and dynamic input batching for GPU throughput. Kubernetes HPA adds replicas under load, maintaining p99 latency under 45ms at sustained 1,200+ req/sec.",
  },
  {
    chunks: [
      "Walk-forward validation advances a fixed-length training window by 5 days per iteration, testing on the immediately following period to prevent lookahead bias.",
      "14 technical indicators including RSI, MACD, Bollinger Bands, ATR, and VWAP serve as model input features with a 14-day lag.",
      "Monte Carlo confidence intervals are estimated from 500 bootstrapped prediction runs on each held-out test window.",
    ],
    answer: "QuantML uses anchored walk-forward cross-validation: the model trains on a rolling 252-day window and predicts the next 10 trading days, advancing 5 days per fold. This prevents lookahead bias and generates realistic performance estimates. Directional accuracy of 61% was achieved across 24 months of held-out test data.",
  },
];

/* ─── SectionTitle component ──────────────────────────────────────────── */
function SectionTitle({ kicker, title, copy }) {
  return (
    <motion.div
      className="section-title"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="kicker mono">{kicker}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </motion.div>
  );
}

/* ─── HomePage ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const cardY = useTransform(heroProgress, [0, 1], [0, -80]);
  const progressScale = useSpring(pageProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

  const [isChessOpen, setIsChessOpen] = useState(false);
  const [chessFen, setChessFen] = useState("start");
  const [chessStatus, setChessStatus] = useState("Your move (White).");
  const [chessMoves, setChessMoves] = useState([]);
  const [selectedSq, setSelectedSq] = useState("");
  const [sfReady, setSfReady] = useState(false);
  const [engineThinking, setEngineThinking] = useState(false);
  const [boardWidth, setBoardWidth] = useState(380);

  const [isTradingOpen, setIsTradingOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(() => pickRandomTicker());
  const [tradingData, setTradingData] = useState(null);
  const [tradingLoading, setTradingLoading] = useState(false);
  const [tradingError, setTradingError] = useState("");

  const [isLLMOpen, setIsLLMOpen] = useState(false);

  const [isRAGOpen, setIsRAGOpen] = useState(false);
  const [ragIdx, setRagIdx] = useState(-1);
  const [ragStage, setRagStage] = useState("idle");
  const [ragChunks, setRagChunks] = useState([]);
  const [ragAnswer, setRagAnswer] = useState("");

  const [isAPIOpen, setIsAPIOpen] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiRes, setApiRes] = useState(null);

  const [isQuantOpen, setIsQuantOpen] = useState(false);
  const [quantSeed, setQuantSeed] = useState(1);

  const chessRef = useRef(new Chess());
  const sfRef = useRef(null);
  const sfReadyRef = useRef(false);
  const boardContainerRef = useRef(null);
  const brownianRef = useRef(null);
  const llmCanvasRef = useRef(null);
  const quantCanvasRef = useRef(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectData;
    return projectData.filter((p) => p.status.toLowerCase() === activeFilter);
  }, [activeFilter]);

  const currentProject = filteredProjects[activeSlide] ?? null;

  const selectedStockMeta = useMemo(
    () => stockUniverse.find((s) => s.ticker === selectedTicker) ?? stockUniverse[0],
    [selectedTicker]
  );

  const optionsSurfaceData = useMemo(() => {
    if (!tradingData) return [];
    return [{ type: "surface", x: tradingData.strikes, y: tradingData.expiryLabels, z: tradingData.volumeSurface, colorscale: "Portland", showscale: true, hovertemplate: "Strike: %{x}<br>Expiry: %{y}<br>Vol: %{z}<extra></extra>" }];
  }, [tradingData]);

  const optionsSurfaceLayout = useMemo(() => ({
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 0, r: 0, b: 0, t: 16 },
    scene: {
      bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Strike", color: "#dcecff" },
      yaxis: { title: "Expiry", color: "#dcecff" },
      zaxis: { title: "Volume", color: "#dcecff" },
      camera: { eye: { x: 1.35, y: 1.2, z: 0.95 } },
    },
  }), []);

  const sqStyles = useMemo(() => {
    if (!selectedSq) return {};
    return { [selectedSq]: { boxShadow: "inset 0 0 0 3px rgba(124,58,237,0.85)" } };
  }, [selectedSq]);

  const syncChess = (thinking = false) => {
    const g = chessRef.current;
    setChessFen(g.fen());
    setChessMoves(g.history());
    setEngineThinking(thinking);
    setChessStatus(getChessStatus(g, thinking));
  };

  const doComputerMove = () => {
    const g = chessRef.current;
    if (g.turn() !== "b" || g.isGameOver()) { syncChess(false); return; }
    if (sfRef.current && sfReadyRef.current) {
      setEngineThinking(true);
      setChessStatus(getChessStatus(g, true));
      sfRef.current.postMessage(`position fen ${g.fen()}`);
      sfRef.current.postMessage("go depth 10");
      return;
    }
    setTimeout(() => {
      const mv = getMinimaxMove(g);
      if (mv) g.move(mv);
      syncChess(false);
    }, 160);
  };

  const tryHumanMove = (from, to) => {
    const g = chessRef.current;
    if (g.turn() !== "w" || g.isGameOver()) return false;
    const piece = g.get(from);
    if (!piece || piece.color !== "w") return false;
    const mv = g.move({ from, to, promotion: "q" });
    if (!mv) return false;
    setSelectedSq("");
    syncChess(false);
    setTimeout(doComputerMove, 160);
    return true;
  };

  const onDrop = (from, to) => tryHumanMove(from, to);

  const onSqClick = (sq) => {
    const g = chessRef.current;
    if (g.turn() !== "w" || g.isGameOver()) { setSelectedSq(""); return; }
    const piece = g.get(sq);
    if (!selectedSq) { if (piece?.color === "w") setSelectedSq(sq); return; }
    if (selectedSq === sq) { setSelectedSq(""); return; }
    if (tryHumanMove(selectedSq, sq)) return;
    if (piece?.color === "w") setSelectedSq(sq); else setSelectedSq("");
  };

  const resetChess = () => {
    chessRef.current = new Chess();
    setSelectedSq("");
    sfRef.current?.postMessage("ucinewgame");
    syncChess(false);
  };

  const runRAG = async (idx) => {
    setRagIdx(idx);
    setRagStage("searching");
    setRagChunks([]);
    setRagAnswer("");
    await new Promise((r) => setTimeout(r, 650));
    const d = RAG_DATA[idx];
    for (const chunk of d.chunks) {
      await new Promise((r) => setTimeout(r, 380));
      setRagChunks((prev) => [...prev, chunk]);
    }
    setRagStage("synthesizing");
    await new Promise((r) => setTimeout(r, 700));
    setRagAnswer(d.answer);
    setRagStage("done");
  };

  const runAPITest = async () => {
    setApiLoading(true);
    setApiRes(null);
    const t0 = Date.now();
    await new Promise((r) => setTimeout(r, 340 + Math.random() * 140));
    setApiRes({
      model: "sentiment-finance-v2",
      input: "Q3 earnings beat expectations with strong net interest margins",
      prediction: "positive",
      confidence: parseFloat((0.88 + Math.random() * 0.1).toFixed(3)),
      tokens_processed: 12,
      latency_ms: Date.now() - t0,
      cached: false,
      version: "2.1.0",
    });
    setApiLoading(false);
  };

  useLLMTraining(llmCanvasRef, isLLMOpen);

  useEffect(() => {
    syncChess(false);
    if (typeof window === "undefined") return;
    let worker;
    try { worker = new Worker(STOCKFISH_URL); } catch { return; }
    sfRef.current = worker;
    worker.onerror = () => setSfReady(false);
    worker.onmessage = (e) => {
      const line = typeof e.data === "string" ? e.data : (e.data?.data ?? "");
      if (line.includes("readyok")) { setSfReady(true); return; }
      const bm = parseStockfishBestMove(line);
      if (!bm) return;
      const g = chessRef.current;
      if (g.turn() !== "b" || g.isGameOver()) { syncChess(false); return; }
      const result = g.move({ from: bm.slice(0, 2), to: bm.slice(2, 4), promotion: bm[4] ?? "q" });
      if (result) syncChess(false);
    };
    worker.postMessage("uci");
    worker.postMessage("isready");
    return () => { worker.terminate(); sfRef.current = null; };
  }, []);

  useEffect(() => { sfReadyRef.current = sfReady; }, [sfReady]);

  useEffect(() => {
    if (!isChessOpen) return;
    if (!boardContainerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setBoardWidth(Math.min(500, Math.max(260, Math.floor(w))));
    });
    obs.observe(boardContainerRef.current);
    return () => obs.disconnect();
  }, [isChessOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setIsChessOpen(false); setIsTradingOpen(false); setIsLLMOpen(false);
      setIsRAGOpen(false); setIsAPIOpen(false); setIsQuantOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setActiveSlide(0); setSlideDir(1); }, [activeFilter]);
  useEffect(() => { if (activeSlide >= filteredProjects.length) setActiveSlide(0); }, [activeSlide, filteredProjects.length]);

  useEffect(() => { if (isRAGOpen) { setRagIdx(-1); setRagStage("idle"); setRagChunks([]); setRagAnswer(""); } }, [isRAGOpen]);
  useEffect(() => { if (isAPIOpen) { setApiRes(null); setApiLoading(false); } }, [isAPIOpen]);

  useEffect(() => {
    if (!isTradingOpen) return;
    let cancelled = false;
    const load = async () => {
      setTradingLoading(true); setTradingError(""); setTradingData(null);
      try {
        let data = null;
        try {
          const r = await fetch(`/api/market-data?ticker=${selectedTicker}`, { cache: "no-store" });
          if (r.ok) { const j = await r.json(); if (j.success) data = j; }
        } catch {}
        if (!data) {
          const r = await fetch("/market-data-cache.json", { cache: "no-store" });
          if (!r.ok) throw new Error("Static cache unavailable.");
          const j = await r.json();
          const rec = j?.records?.[selectedTicker];
          if (!rec) throw new Error(`${selectedTicker} not in cache.`);
          data = rec;
        }
        if (!cancelled) setTradingData({ ticker: selectedTicker, ...data });
      } catch (err) {
        if (!cancelled) { setTradingError(err.message); setTradingData(null); }
      } finally { if (!cancelled) setTradingLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedTicker, isTradingOpen]);

  useEffect(() => {
    if (!isTradingOpen || !tradingData || !brownianRef.current) return;
    const draw = () => drawBrownian(brownianRef.current, tradingData.spotPrice, tradingData.annualDrift, tradingData.annualVolatility);
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [isTradingOpen, tradingData]);

  useEffect(() => {
    if (!isQuantOpen || !quantCanvasRef.current) return;
    const draw = () => drawQuantChart(quantCanvasRef.current, quantSeed);
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [isQuantOpen, quantSeed]);

  const changeSlide = (dir) => {
    if (filteredProjects.length <= 1) return;
    setSlideDir(dir);
    setActiveSlide((p) => (p + dir + filteredProjects.length) % filteredProjects.length);
  };

  const jumpToSlide = (i) => {
    if (i === activeSlide) return;
    setSlideDir(i > activeSlide ? 1 : -1);
    setActiveSlide(i);
  };

  return (
    <div className="site-shell">
      <motion.div className="page-progress" style={{ scaleX: progressScale }} />
      <div className="bg-grid" />
      <motion.div className="halo halo-one" animate={{ x: [0, 24, -14, 0], y: [0, -14, 10, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="halo halo-two" animate={{ x: [0, -20, 16, 0], y: [0, 16, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="halo halo-three" animate={{ x: [0, 18, -12, 0], y: [0, -10, 8, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <motion.header className="topbar" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="container topbar-inner">
          <a href="#top" className="brand mono">BTG // Software</a>
          <nav className="nav">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
            <a href="#contact" className="nav-cta">Hire Me</a>
          </nav>
        </div>
      </motion.header>

      <main className="container" id="top">

        <motion.section ref={heroRef} className="hero" initial="hidden" animate="visible" variants={stagger}>
          <div className="hero-layout">
            <div>
              <motion.p className="hero-kicker mono" variants={fadeUp}>Open to Software & AI Roles · 2026</motion.p>
              <motion.h1 className="hero-title" variants={fadeUp}>Bhargava Teja Reddy Guddeti</motion.h1>
              <motion.p className="hero-subtitle" variants={fadeUp}>
                Building production-minded software with a focus on AI/ML systems, backend engineering, and financial analytics. Strong data structures foundation with a bias for practical execution.
              </motion.p>
              <motion.div className="hero-actions" variants={fadeUp}>
                <a href="#work" className="btn btn-primary">Explore Work</a>
                <a href="#contact" className="btn btn-secondary">Contact</a>
              </motion.div>
            </div>
            <motion.aside className="signal-card" style={{ y: cardY }} variants={fadeUp}>
              <p className="signal-label mono">Current Focus</p>
              <h3>LLM systems, inference optimization, and production ML pipelines.</h3>
              <ul>
                <li>Fine-tuning & RAG architectures</li>
                <li>Fintech analytics & quantitative modeling</li>
                <li>FastAPI + Docker microservices</li>
              </ul>
              <div className="signal-tags">
                <span>PyTorch</span><span>LangChain</span><span>FastAPI</span><span>Next.js</span>
              </div>
            </motion.aside>
          </div>
          <motion.div className="metric-grid" variants={stagger}>
            {metrics.map((m) => (
              <motion.article key={m.label} className="metric-card" variants={fadeUp}>
                <p className="metric-value">{m.value}</p>
                <p className="metric-label">{m.label}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <section className="marquee-wrap">
          <div className="marquee-track mono">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </section>

        <motion.section id="work" className="section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <SectionTitle
            kicker="Project Portfolio"
            title="Selected Software & AI Projects"
            copy="Across machine learning systems, backend engineering, fintech analytics, and healthcare — each project is built around a real workflow with interactive demos."
          />

          <div className="filter-row">
            {statusFilters.map((f) => (
              <button key={f.value} type="button" className={`filter-btn${activeFilter === f.value ? " active" : ""}`} onClick={() => setActiveFilter(f.value)}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="project-slider">
            <div className="slider-nav">
              <p className="slider-meta mono">
                {filteredProjects.length ? `${String(activeSlide + 1).padStart(2, "0")} / ${String(filteredProjects.length).padStart(2, "0")}` : "00 / 00"}
              </p>
              <div className="slider-controls">
                <button type="button" className="slider-btn" onClick={() => changeSlide(-1)} disabled={filteredProjects.length <= 1}>← Prev</button>
                <button type="button" className="slider-btn" onClick={() => changeSlide(1)} disabled={filteredProjects.length <= 1}>Next →</button>
              </div>
            </div>

            <div className="project-stage">
              <AnimatePresence initial={false} mode="wait" custom={slideDir}>
                {currentProject ? (
                  <motion.article
                    key={`${activeFilter}-${currentProject.id}`}
                    custom={slideDir}
                    className="project-card"
                    variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    whileHover={{ y: -4 }}
                    style={{ "--accent": currentProject.accent }}
                  >
                    <div className="project-card-accent" />
                    <div className="project-head">
                      <div>
                        <span className="project-tag mono">{currentProject.tag}</span>
                        <h3>{currentProject.title}</h3>
                      </div>
                      <span className={`project-status mono ${currentProject.status === "Shipped" ? "status-shipped" : "status-wip"}`}>
                        {currentProject.status}
                      </span>
                    </div>
                    <p className="project-summary">{currentProject.summary}</p>
                    <p className="project-impact">{currentProject.impact}</p>
                    <div className="chip-row">
                      {currentProject.stack.map((s) => <span key={s} className="chip mono">{s}</span>)}
                    </div>
                    <div className="project-foot">
                      <div className="project-links">
                        {currentProject.links.map((l) => (
                          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>
                        ))}
                      </div>
                      {currentProject.demoType === "chess" && (
                        <button type="button" className="demo-btn" onClick={() => setIsChessOpen(true)}>
                          ♟ Chess Arena
                        </button>
                      )}
                      {currentProject.demoType === "trading" && (
                        <button type="button" className="demo-btn demo-finance" onClick={() => { setSelectedTicker(pickRandomTicker(selectedTicker)); setIsTradingOpen(true); }}>
                          📈 Live Analytics
                        </button>
                      )}
                      {currentProject.demoType === "llm" && (
                        <button type="button" className="demo-btn demo-ai" onClick={() => setIsLLMOpen(true)}>
                          🧠 Training Run
                        </button>
                      )}
                      {currentProject.demoType === "rag" && (
                        <button type="button" className="demo-btn demo-ai" onClick={() => setIsRAGOpen(true)}>
                          🔍 Try a Query
                        </button>
                      )}
                      {currentProject.demoType === "api" && (
                        <button type="button" className="demo-btn demo-backend" onClick={() => setIsAPIOpen(true)}>
                          ⚡ Test Endpoint
                        </button>
                      )}
                      {currentProject.demoType === "quant" && (
                        <button type="button" className="demo-btn demo-finance" onClick={() => setIsQuantOpen(true)}>
                          📊 View Predictions
                        </button>
                      )}
                    </div>
                  </motion.article>
                ) : (
                  <motion.p className="project-empty" variants={fadeUp}>No projects for this filter.</motion.p>
                )}
              </AnimatePresence>
            </div>

            {filteredProjects.length > 1 && (
              <div className="slider-dots">
                {filteredProjects.map((p, i) => (
                  <button key={p.id} type="button" className={`slider-dot${i === activeSlide ? " active" : ""}`} onClick={() => jumpToSlide(i)} aria-label={`Project ${i + 1}`} />
                ))}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section id="experience" className="section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionTitle
            kicker="Professional Experience"
            title="Experience in Software Delivery"
            copy="Professional software development experience focused on financial systems at Capri Global Capital."
          />
          <div className="experience-timeline">
            {experienceData.map((item, idx) => (
              <motion.article key={item.organization} className="experience-entry" variants={fadeUp} whileHover={{ y: -3 }}>
                <div className="experience-rail" aria-hidden>
                  <span className="experience-dot" />
                  {idx < experienceData.length - 1 && <span className="experience-line" />}
                </div>
                <div className="experience-content">
                  <div className="experience-meta-row">
                    <p className="experience-period mono">{item.period}</p>
                    <span className="experience-domain mono">{item.domain}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p className="experience-org">{item.organization}</p>
                  <p className="experience-location">{item.location}</p>
                  <ul className="experience-list">
                    {item.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                  <div className="experience-tool-row">
                    {item.tools.map((t) => <span key={t} className="experience-tool mono">{t}</span>)}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="skills" className="section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <SectionTitle
            kicker="Technical Competencies"
            title="Engineering Capabilities"
            copy="From AI/ML systems to full-stack delivery and data engineering — end-to-end technical breadth."
          />
          <div className="skills-theme">
            <motion.div className="skills-theme-glow skills-theme-glow-one" animate={{ x: [0, 30, -18, 0], y: [0, -20, 12, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="skills-theme-glow skills-theme-glow-two" animate={{ x: [0, -26, 16, 0], y: [0, 16, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
            <div className="skills-layout">
              {skillGroups.map((g) => (
                <motion.article key={g.title} className="skills-card" variants={fadeUp} whileHover={{ y: -6, scale: 1.01 }}>
                  <p className="skill-group-index mono">{g.idx}</p>
                  <h3>{g.title}</h3>
                  <p className="skill-group-summary">{g.summary}</p>
                  <div className="skill-pill-grid">
                    {g.items.map((item, i) => (
                      <motion.span key={item} className="skill-pill mono"
                        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.28, delay: i * 0.02 }}
                      >{item}</motion.span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
            <motion.div className="tech-cloud" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <p className="tech-cloud-title mono">Full Technology Stack</p>
              <div className="tech-cloud-pills">
                {technologyStack.map((tech, i) => (
                  <motion.span key={tech} className="tech-pill mono" style={{ "--float-delay": `${(i % 8) * 0.52}s` }} whileHover={{ y: -4, scale: 1.05 }}>
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section id="education" className="section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <SectionTitle kicker="Academic Background" title="Educational Qualifications" />
          <div className="timeline">
            {education.map((e) => (
              <motion.article key={e.degree} className="timeline-item" variants={fadeUp}>
                <h3>{e.degree}</h3>
                <p className="timeline-institution">{e.institution}</p>
                <p>{e.details}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="contact" className="section contact-panel" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
          <SectionTitle
            kicker="Contact Information"
            title="Available for Software Engineering Opportunities"
            copy="Open to discussing roles across AI/ML engineering, backend, and full-stack product delivery."
          />
          <div className="contact-links">
            <a href="mailto:guddeti.bhargavareddy@gmail.com">Email</a>
            <a href="https://github.com/Teja3804" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/bhargava-teja-reddy-guddeti-243983228/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://leetcode.com/u/user5873Y/" target="_blank" rel="noreferrer">LeetCode</a>
          </div>
        </motion.section>
      </main>

      {/* Chess Modal */}
      <AnimatePresence>
        {isChessOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChessOpen(false)}>
            <motion.div className="modal-box chess-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">Human vs Computer</p>
                  <h3 className="modal-title">Chess Arena</h3>
                </div>
                <button type="button" className="modal-close" onClick={() => setIsChessOpen(false)}>✕</button>
              </div>
              <div className="chess-layout">
                <div ref={boardContainerRef} className="chess-board-wrap">
                  <Chessboard
                    id="main-board"
                    position={chessFen}
                    boardWidth={boardWidth}
                    arePiecesDraggable
                    onPieceDrop={onDrop}
                    onSquareClick={onSqClick}
                    customSquareStyles={sqStyles}
                    boardOrientation="white"
                    customDarkSquareStyle={{ backgroundColor: "#769656" }}
                    customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
                  />
                </div>
                <div className="chess-side">
                  <p className="chess-status">{chessStatus}</p>
                  <p className="chess-engine mono">{sfReady ? "✓ Stockfish Online" : "● Minimax AI Active"}</p>
                  {engineThinking && <p className="chess-thinking mono">Engine thinking…</p>}
                  <div className="chess-actions">
                    <button type="button" onClick={resetChess}>New Game</button>
                  </div>
                  <div className="chess-history">
                    <h4>Move History</h4>
                    <p className="mono">{chessMoves.length ? chessMoves.join(" ") : "No moves yet."}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trading Modal */}
      <AnimatePresence>
        {isTradingOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTradingOpen(false)}>
            <motion.div className="modal-box dark-box trading-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">Live Market Analytics</p>
                  <h3 className="modal-title">{selectedStockMeta.name} ({selectedTicker})</h3>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="dark-action-btn mono" onClick={() => setSelectedTicker(pickRandomTicker(selectedTicker))}>Randomize</button>
                  <button type="button" className="modal-close dark" onClick={() => setIsTradingOpen(false)}>✕</button>
                </div>
              </div>
              <div className="dark-body">
                {tradingLoading && <p className="dark-feedback">Loading market data…</p>}
                {tradingError && <p className="dark-feedback error">{tradingError}</p>}
                {tradingData && (
                  <>
                    <div className="trading-stat-grid">
                      <article><span className="mono">Ticker</span><p>{tradingData.ticker}</p></article>
                      <article><span className="mono">Spot Price</span><p>{toUsd(tradingData.spotPrice)}</p></article>
                      <article><span className="mono">Simulated Paths</span><p>{BROWNIAN_PATHS.toLocaleString()}</p></article>
                      <article><span className="mono">Strike Range</span><p>{tradingData.strikes?.[0]} – {tradingData.strikes?.[tradingData.strikes.length - 1]}</p></article>
                    </div>
                    <div className="dark-panel">
                      <div className="dark-panel-head">
                        <h4>One-Year Brownian Motion Simulation</h4>
                        <p className="mono">{BROWNIAN_PATHS.toLocaleString()} paths · expected path highlighted</p>
                      </div>
                      <canvas ref={brownianRef} className="brownian-canvas" />
                    </div>
                    <div className="dark-panel">
                      <div className="dark-panel-head">
                        <h4>3D Options Volume Surface</h4>
                        <p className="mono">Next 2 months · {OPTIONS_RANGE * 2} strike points</p>
                      </div>
                      <Plot
                        data={optionsSurfaceData}
                        layout={optionsSurfaceLayout}
                        config={{ displaylogo: false, responsive: true, modeBarButtonsToRemove: ["lasso2d", "select2d", "toggleSpikelines", "autoScale2d"] }}
                        style={{ width: "100%", height: "400px" }}
                        useResizeHandler
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LLM Training Modal */}
      <AnimatePresence>
        {isLLMOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLLMOpen(false)}>
            <motion.div className="modal-box dark-box llm-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">LoRA Fine-Tuning · domain-adapt-v2</p>
                  <h3 className="modal-title">Live Training Run Visualization</h3>
                </div>
                <button type="button" className="modal-close dark" onClick={() => setIsLLMOpen(false)}>✕</button>
              </div>
              <div className="dark-body">
                <div className="llm-meta-row">
                  {[["Model", "llama-3-8b-instruct"], ["Method", "QLoRA r=16 α=32"], ["Dataset", "12K finance docs"], ["Precision", "bf16"]].map(([k, v]) => (
                    <span key={k} className="llm-chip mono">{k}: <strong>{v}</strong></span>
                  ))}
                </div>
                <div className="llm-canvas-wrap">
                  <canvas ref={llmCanvasRef} className="llm-canvas" />
                </div>
                <div className="llm-legend mono">
                  <span style={{ color: "rgba(100,195,255,0.9)" }}>─ Training Loss</span>
                  <span style={{ color: "rgba(255,145,80,0.9)", marginLeft: "1.2rem" }}>- - Validation Loss</span>
                </div>
                <div className="llm-actions">
                  <button type="button" className="dark-action-btn mono" onClick={() => { setIsLLMOpen(false); setTimeout(() => setIsLLMOpen(true), 60); }}>↺ Restart Training</button>
                </div>
                <div className="llm-config-grid">
                  {[["Learning Rate", "2e-4"], ["Batch Size", "4 (grad accum 8)"], ["Warmup Steps", "100"], ["Optimizer", "AdamW 8-bit"], ["Scheduler", "Cosine Annealing"], ["Target Modules", "q_proj, v_proj"]].map(([k, v]) => (
                    <div key={k} className="llm-config-item"><span className="mono">{k}</span><p>{v}</p></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAG Modal */}
      <AnimatePresence>
        {isRAGOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRAGOpen(false)}>
            <motion.div className="modal-box dark-box rag-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">FAISS + BM25 · Cross-Encoder Re-Ranking</p>
                  <h3 className="modal-title">RAG Query Demo</h3>
                </div>
                <button type="button" className="modal-close dark" onClick={() => setIsRAGOpen(false)}>✕</button>
              </div>
              <div className="dark-body">
                <p className="rag-instruction mono">Click a query to run the full retrieval + synthesis pipeline:</p>
                <div className="rag-queries">
                  {RAG_QUERIES.map((q, i) => (
                    <button key={i} type="button" className={`rag-q-btn${ragIdx === i && ragStage !== "idle" ? " active" : ""}`} onClick={() => runRAG(i)} disabled={ragStage === "searching" || ragStage === "synthesizing"}>
                      {q}
                    </button>
                  ))}
                </div>
                {ragStage !== "idle" && (
                  <div className="rag-results">
                    <p className="mono rag-label">
                      {ragStage === "searching" && ragChunks.length === 0 ? "⏳ Searching vector index + BM25…" : `📄 Retrieved Chunks (${ragChunks.length}/3 · cosine similarity + re-ranked)`}
                    </p>
                    <AnimatePresence>
                      {ragChunks.map((chunk, i) => (
                        <motion.div key={i} className="rag-chunk" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                          <span className="mono rag-chunk-id">chunk_{i + 1}.txt</span>
                          <p>{chunk}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {(ragStage === "synthesizing" || ragStage === "done") && (
                      <motion.div className="rag-answer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="mono rag-label">
                          {ragStage === "synthesizing" ? "✍️ Synthesizing answer with LLM…" : "✓ Synthesized Answer"}
                        </p>
                        {ragStage === "done" && <p className="rag-answer-text">{ragAnswer}</p>}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Tester Modal */}
      <AnimatePresence>
        {isAPIOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAPIOpen(false)}>
            <motion.div className="modal-box dark-box api-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">FastAPI · sentiment-finance-v2 · POST /predict</p>
                  <h3 className="modal-title">ML Inference Endpoint Tester</h3>
                </div>
                <button type="button" className="modal-close dark" onClick={() => setIsAPIOpen(false)}>✕</button>
              </div>
              <div className="dark-body">
                <div className="api-panel">
                  <p className="mono api-label">REQUEST</p>
                  <pre className="api-code">{JSON.stringify({ model: "sentiment-finance-v2", input: "Q3 earnings beat expectations with strong net interest margins", options: { return_confidence: true } }, null, 2)}</pre>
                  <button type="button" className="api-send-btn mono" onClick={runAPITest} disabled={apiLoading}>
                    {apiLoading ? "⏳ Sending request…" : "⚡ Send Request"}
                  </button>
                </div>
                <AnimatePresence>
                  {apiRes && (
                    <motion.div className="api-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p className="mono api-label">RESPONSE</p>
                        <span className="mono api-ok-badge">200 OK · {apiRes.latency_ms}ms</span>
                      </div>
                      <pre className="api-code response">{JSON.stringify(apiRes, null, 2)}</pre>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="infra-grid">
                  {[["Runtime", "Python 3.11 + FastAPI"], ["Cache", "Redis · 5-min TTL"], ["Deployment", "Docker · Blue-Green"], ["Throughput", "1,200 req/sec · p99 45ms"]].map(([k, v]) => (
                    <div key={k} className="infra-item"><span className="mono">{k}</span><p>{v}</p></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QuantML Modal */}
      <AnimatePresence>
        {isQuantOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuantOpen(false)}>
            <motion.div className="modal-box dark-box quant-box" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <p className="modal-kicker mono">LSTM · 14 Features · Walk-Forward Validation</p>
                  <h3 className="modal-title">QuantML Prediction Visualization</h3>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="dark-action-btn mono" onClick={() => setQuantSeed((s) => (s % 8) + 1)}>Randomize</button>
                  <button type="button" className="modal-close dark" onClick={() => setIsQuantOpen(false)}>✕</button>
                </div>
              </div>
              <div className="dark-body">
                <canvas ref={quantCanvasRef} className="quant-canvas" />
                <div className="quant-legend mono">
                  <span style={{ color: "rgba(130,210,255,0.85)" }}>─ Actual</span>
                  <span style={{ color: "rgba(80,220,140,0.9)", marginLeft: "1.1rem" }}>- - LSTM Predicted</span>
                  <span style={{ color: "rgba(255,200,70,0.9)", marginLeft: "1.1rem" }}>── 10-Day Forecast</span>
                </div>
                <div className="infra-grid" style={{ marginTop: "0.9rem" }}>
                  {[["Architecture", "Stacked LSTM (2 layers, 128 hidden)"], ["Features", "14 technical indicators (RSI, MACD, ATR…)"], ["Validation", "Walk-forward (252-day window, 5-day stride)"], ["Performance", "61% directional accuracy · 4.2% MAPE"]].map(([k, v]) => (
                    <div key={k} className="infra-item"><span className="mono">{k}</span><p>{v}</p></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
