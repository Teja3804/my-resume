"use client";

import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Chessboard } from "react-chessboard";
import { useEffect, useMemo, useRef, useState } from "react";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false
});

const navLinks = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" }
];

const metrics = [
  { value: "4+", label: "Software projects delivered" },
  { value: "1", label: "Professional experience role highlighted" },
  { value: "3", label: "Core domains: finance, healthcare, systems" }
];

const projectData = [
  {
    id: "investment-platform",
    title: "Selected Stocks Short-Term Investment Platform",
    status: "Shipped",
    summary:
      "Portfolio tracking and performance analytics with a practical data layer for investment decision support.",
    stack: ["Python", "SQL", "JavaScript", "Analytics"],
    impact: "Designed for day-to-day portfolio visibility and easier performance breakdowns.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/TheInterstingGame" }]
  },
  {
    id: "chess",
    title: "Interactive Chess Application",
    status: "Shipped",
    summary:
      "A clean browser chess experience focused on gameplay flow, move handling, and user-friendly controls.",
    stack: ["JavaScript", "HTML", "CSS", "Game Logic"],
    impact: "Built to demonstrate frontend engineering and state-driven interactions.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/chesssunreddy" }]
  },
  {
    id: "patient-portal",
    title: "Patient Portal Management System",
    status: "In Progress",
    summary:
      "Healthcare workflow platform for appointments, doctor-patient communication, and structured records.",
    stack: ["Python", "SQL", "JavaScript", "Healthcare"],
    impact: "Aims to reduce friction in patient communication and care coordination.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }]
  },
  {
    id: "algo-trading",
    title: "Algorithmic Trading Strategy Platform",
    status: "In Progress",
    summary:
      "Strategy execution workspace with market analysis, testing loops, and automation-oriented architecture.",
    stack: ["Python", "Quant", "DSA", "Automation"],
    impact: "Focused on disciplined system design for repeatable strategy experimentation.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/BrowmianSimulation" }]
  }
];

const stockUniverse = [
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "GOOG", name: "Google" },
  { ticker: "AAPL", name: "Apple" },
  { ticker: "BAC", name: "Bank of America" },
  { ticker: "NVDA", name: "NVIDIA" }
];

const stockfishWorkerUrl = "https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js";
const brownianPathCount = 10000;
const brownianYears = 1;
const tradingDays = 252;
const optionsRangePoints = 30;

const experienceData = [
  {
    role: "Software Developer",
    organization: "Capri Global Capital",
    period: "2022 - 2023",
    location: "India",
    domain: "Financial Services",
    highlights: [
      "Developed and supported software features for financial workflows and operational systems.",
      "Collaborated with cross-functional teams to deliver stable, production-ready releases.",
      "Contributed to backend integration, data handling, and application performance improvements."
    ],
    tools: ["Python", "SQL", "JavaScript", "API Integration", "Performance Optimization"]
  }
];

const skillGroups = [
  {
    title: "Frontend Engineering",
    summary: "Building responsive, fast, and polished user interfaces.",
    items: [
      "React.js",
      "Next.js",
      "JavaScript (ES6+)",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Responsive Design",
      "Framer Motion"
    ]
  },
  {
    title: "Backend and API Engineering",
    summary: "Designing service layers and robust integration workflows.",
    items: [
      "Python",
      "Node.js",
      "Express.js",
      "FastAPI",
      "REST API Design",
      "Authentication Flows",
      "System Design Fundamentals",
      "Database Integration"
    ]
  },
  {
    title: "Data and Database Systems",
    summary: "Structuring data models and analytics for product decision-making.",
    items: [
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Pandas",
      "NumPy",
      "Data Modeling",
      "Performance Analytics"
    ]
  },
  {
    title: "Core Computer Science",
    summary: "Applying algorithmic thinking to practical product implementation.",
    items: [
      "Data Structures",
      "Algorithms",
      "Object-Oriented Design",
      "Time and Space Optimization",
      "Problem Solving",
      "Debugging",
      "Code Quality Practices",
      "Technical Documentation"
    ]
  },
  {
    title: "Developer Tools and Delivery",
    summary: "Shipping production-ready software with modern development tooling.",
    items: [
      "Git and GitHub",
      "Docker",
      "CI/CD Workflows",
      "Linux and Command Line",
      "Postman",
      "Unit Testing",
      "Integration Testing",
      "Agile Collaboration"
    ]
  }
];

const technologyStack = [
  "React.js",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Express.js",
  "Python",
  "FastAPI",
  "Flask",
  "REST APIs",
  "GraphQL Basics",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Pandas",
  "NumPy",
  "Git",
  "GitHub",
  "Docker",
  "CI/CD",
  "Linux",
  "Postman",
  "Jira",
  "Agile",
  "System Design"
];

const education = [
  {
    degree: "Master of Information Systems",
    institution: "Saint Louis University, Saint Louis, Missouri",
    details:
      "Advanced work in information systems, software development, and business-aligned technical solutions."
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const statusFilters = [
  { value: "all", label: "All Projects" },
  { value: "shipped", label: "Shipped" },
  { value: "in progress", label: "In Progress" }
];

const marqueeText =
  "NEXT.JS  FRAMER MOTION  PYTHON  JAVASCRIPT  SQL  DATA STRUCTURES  PRODUCT MINDSET  FINTECH  HEALTHCARE SYSTEMS  ALGORITHMIC THINKING";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  },
  exit: (direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] }
  })
};

function pickRandomTicker(previousTicker = "") {
  const available = stockUniverse.filter((stock) => stock.ticker !== previousTicker);
  if (!available.length) return stockUniverse[0].ticker;
  return available[Math.floor(Math.random() * available.length)].ticker;
}

function gaussianRandom() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function toUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function parseStockfishBestMove(rawLine) {
  if (!rawLine || !rawLine.startsWith("bestmove ")) return null;
  const parts = rawLine.trim().split(/\s+/);
  if (parts.length < 2 || parts[1] === "(none)") return null;
  return parts[1];
}

function getChessStatus(game, engineThinking) {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? "Checkmate. Computer wins." : "Checkmate. You win.";
  }
  if (game.isDraw()) return "Draw. Start a new game to play again.";
  if (engineThinking) return "Computer is thinking...";
  return game.turn() === "w" ? "Your move (White)." : "Computer to move (Black).";
}

function drawBrownianSimulation(canvas, startPrice, annualDrift, annualVolatility) {
  if (!canvas || !startPrice || !Number.isFinite(startPrice)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(640, Math.floor(canvas.clientWidth || 720));
  const height = Math.max(280, Math.floor(canvas.clientHeight || 320));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#08192a");
  gradient.addColorStop(1, "#0c2438");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(151, 210, 255, 0.08)";
  for (let i = 1; i < 6; i += 1) {
    const y = (height / 6) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const dt = brownianYears / tradingDays;
  const safeVol = Math.max(annualVolatility, 0.12);
  const drift = annualDrift || 0;
  const minPrice = Math.max(
    0.01,
    startPrice * Math.exp((drift - 0.5 * safeVol * safeVol) * brownianYears - 4 * safeVol)
  );
  const maxPrice = startPrice * Math.exp((drift - 0.5 * safeVol * safeVol) * brownianYears + 4 * safeVol);
  const span = Math.max(maxPrice - minPrice, 0.01);

  const valueToY = (price) => height - ((price - minPrice) / span) * height;

  ctx.strokeStyle = "rgba(72, 205, 188, 0.045)";
  ctx.lineWidth = 0.55;
  for (let path = 0; path < brownianPathCount; path += 1) {
    let price = startPrice;
    ctx.beginPath();
    ctx.moveTo(0, valueToY(price));
    for (let step = 1; step <= tradingDays; step += 1) {
      const shock = safeVol * Math.sqrt(dt) * gaussianRandom();
      const driftPart = (drift - 0.5 * safeVol * safeVol) * dt;
      price *= Math.exp(driftPart + shock);
      const x = (step / tradingDays) * width;
      ctx.lineTo(x, valueToY(price));
    }
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 198, 109, 0.95)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let step = 0; step <= tradingDays; step += 1) {
    const t = step * dt;
    const expected = startPrice * Math.exp(drift * t);
    const x = (step / tradingDays) * width;
    const y = valueToY(expected);
    if (step === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(232, 244, 255, 0.88)";
  ctx.font = "12px monospace";
  ctx.fillText("Expected Path", 12, 20);
  ctx.fillText(`${brownianPathCount.toLocaleString()} simulated lines`, 12, 38);
}

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
      {copy ? <p className="section-copy">{copy}</p> : null}
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const cardY = useTransform(heroScrollProgress, [0, 1], [0, -80]);
  const progressScale = useSpring(pageScrollProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3
  });

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isChessModalOpen, setIsChessModalOpen] = useState(false);
  const [chessFen, setChessFen] = useState("start");
  const [chessStatus, setChessStatus] = useState("Your move (White).");
  const [chessMoves, setChessMoves] = useState([]);
  const [isStockfishReady, setIsStockfishReady] = useState(false);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [chessBoardWidth, setChessBoardWidth] = useState(360);
  const [selectedTicker, setSelectedTicker] = useState(() => pickRandomTicker());
  const [tradingData, setTradingData] = useState(null);
  const [isTradingLoading, setIsTradingLoading] = useState(false);
  const [tradingError, setTradingError] = useState("");

  const chessGameRef = useRef(new Chess());
  const stockfishRef = useRef(null);
  const stockfishReadyRef = useRef(false);
  const chessBoardContainerRef = useRef(null);
  const brownianCanvasRef = useRef(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectData;
    return projectData.filter((project) => project.status.toLowerCase() === activeFilter);
  }, [activeFilter]);

  const selectedStockMeta = useMemo(
    () => stockUniverse.find((stock) => stock.ticker === selectedTicker) || stockUniverse[0],
    [selectedTicker]
  );

  const optionsSurfaceData = useMemo(() => {
    if (!tradingData) return [];
    return [
      {
        type: "surface",
        x: tradingData.strikes,
        y: tradingData.expiryLabels,
        z: tradingData.volumeSurface,
        colorscale: "Portland",
        showscale: true,
        hovertemplate: "Strike: %{x}<br>Expiry: %{y}<br>Volume: %{z}<extra></extra>"
      }
    ];
  }, [tradingData]);

  const optionsSurfaceLayout = useMemo(() => {
    if (!tradingData) return {};
    return {
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      plot_bgcolor: "rgba(0, 0, 0, 0)",
      margin: { l: 0, r: 0, b: 0, t: 18 },
      scene: {
        bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Strike", color: "#dcecff" },
        yaxis: { title: "Expiry", color: "#dcecff" },
        zaxis: { title: "Volume", color: "#dcecff" },
        camera: {
          eye: { x: 1.35, y: 1.2, z: 0.95 }
        }
      }
    };
  }, [tradingData]);

  const syncChessState = (thinking = false) => {
    const game = chessGameRef.current;
    setChessFen(game.fen());
    setChessMoves(game.history());
    setIsEngineThinking(thinking);
    setChessStatus(getChessStatus(game, thinking));
  };

  const requestComputerMove = () => {
    const game = chessGameRef.current;
    if (game.turn() !== "b" || game.isGameOver()) {
      syncChessState(false);
      return;
    }

    if (stockfishRef.current && stockfishReadyRef.current) {
      setIsEngineThinking(true);
      setChessStatus(getChessStatus(game, true));
      stockfishRef.current.postMessage(`position fen ${game.fen()}`);
      stockfishRef.current.postMessage("go depth 12");
      return;
    }

    const legalMoves = game.moves({ verbose: true });
    if (!legalMoves.length) {
      syncChessState(false);
      return;
    }

    const fallbackMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    game.move(fallbackMove);
    syncChessState(false);
  };

  const onChessDrop = (sourceSquare, targetSquare) => {
    const game = chessGameRef.current;
    if (game.turn() !== "w" || game.isGameOver()) return false;

    const sourcePiece = game.get(sourceSquare);
    if (!sourcePiece || sourcePiece.color !== "w") return false;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });

    if (!move) return false;
    syncChessState(false);
    window.setTimeout(() => {
      requestComputerMove();
    }, 140);
    return true;
  };

  const resetChessGame = () => {
    chessGameRef.current = new Chess();
    if (stockfishRef.current && stockfishReadyRef.current) {
      stockfishRef.current.postMessage("ucinewgame");
    }
    syncChessState(false);
  };

  const randomizeTicker = () => {
    setSelectedTicker((previousTicker) => pickRandomTicker(previousTicker));
  };

  useEffect(() => {
    syncChessState(false);
  }, []);

  useEffect(() => {
    setActiveSlide(0);
    setSlideDirection(1);
  }, [activeFilter]);

  useEffect(() => {
    if (!filteredProjects.length) {
      setActiveSlide(0);
      return;
    }
    if (activeSlide >= filteredProjects.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, filteredProjects.length]);

  useEffect(() => {
    stockfishReadyRef.current = isStockfishReady;
  }, [isStockfishReady]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let worker = null;
    try {
      worker = new Worker(stockfishWorkerUrl);
    } catch {
      setIsStockfishReady(false);
      return undefined;
    }

    stockfishRef.current = worker;
    worker.onerror = () => {
      setIsStockfishReady(false);
    };
    worker.onmessage = (event) => {
      const rawLine = typeof event.data === "string" ? event.data : event.data?.data;
      if (!rawLine) return;

      if (rawLine.includes("readyok")) {
        setIsStockfishReady(true);
        return;
      }

      const bestMove = parseStockfishBestMove(rawLine);
      if (!bestMove) return;

      const game = chessGameRef.current;
      if (game.turn() !== "b" || game.isGameOver()) {
        syncChessState(false);
        return;
      }

      const moveResult = game.move({
        from: bestMove.slice(0, 2),
        to: bestMove.slice(2, 4),
        promotion: bestMove.length > 4 ? bestMove[4] : "q"
      });

      if (!moveResult) {
        syncChessState(false);
        return;
      }

      syncChessState(false);
    };

    worker.postMessage("uci");
    worker.postMessage("isready");

    return () => {
      worker.terminate();
      stockfishRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isChessModalOpen) return undefined;

    const setBoardSize = () => {
      if (!chessBoardContainerRef.current) return;
      const width = chessBoardContainerRef.current.clientWidth;
      const boundedWidth = Math.min(530, Math.max(260, Math.floor(width)));
      setChessBoardWidth(boundedWidth);
    };

    setBoardSize();
    window.addEventListener("resize", setBoardSize);
    return () => window.removeEventListener("resize", setBoardSize);
  }, [isChessModalOpen]);

  useEffect(() => {
    if (!isChessModalOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsChessModalOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isChessModalOpen]);

  useEffect(() => {
    let isCancelled = false;

    const loadFromStaticCache = async () => {
      const response = await fetch("market-data-cache.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Static cache request failed with status ${response.status}`);
      }
      const payload = await response.json();
      const record = payload?.records?.[selectedTicker];
      if (!record) {
        throw new Error("Requested stock is unavailable in static cache.");
      }
      return record;
    };

    const fetchTradingData = async () => {
      setIsTradingLoading(true);
      setTradingError("");

      try {
        let marketPayload = null;
        try {
          const response = await fetch(`/api/market-data?ticker=${selectedTicker}`, {
            cache: "no-store"
          });
          if (response.ok) {
            const payload = await response.json();
            if (payload?.success) {
              marketPayload = payload;
            } else {
              throw new Error(payload?.error || "Server market response was not successful.");
            }
          } else {
            throw new Error(`Market request failed with status ${response.status}`);
          }
        } catch {
          marketPayload = await loadFromStaticCache();
        }

        if (!isCancelled) {
          setTradingData({
            ticker: selectedTicker,
            spotPrice: marketPayload.spotPrice,
            annualDrift: marketPayload.annualDrift,
            annualVolatility: marketPayload.annualVolatility,
            strikes: marketPayload.strikes,
            expiryLabels: marketPayload.expiryLabels,
            volumeSurface: marketPayload.volumeSurface
          });
          setTradingError("");
        }
      } catch (error) {
        if (!isCancelled) {
          setTradingError(error instanceof Error ? error.message : "Unable to load market data.");
          setTradingData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsTradingLoading(false);
        }
      }
    };

    fetchTradingData();

    return () => {
      isCancelled = true;
    };
  }, [selectedTicker]);

  useEffect(() => {
    if (!tradingData || !brownianCanvasRef.current) return undefined;

    const draw = () => {
      drawBrownianSimulation(
        brownianCanvasRef.current,
        tradingData.spotPrice,
        tradingData.annualDrift,
        tradingData.annualVolatility
      );
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [tradingData]);

  const currentProject = filteredProjects[activeSlide];

  const changeSlide = (direction) => {
    if (filteredProjects.length <= 1) return;
    setSlideDirection(direction);
    setActiveSlide((prev) => {
      const total = filteredProjects.length;
      return (prev + direction + total) % total;
    });
  };

  const jumpToSlide = (index) => {
    if (index === activeSlide) return;
    setSlideDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  };

  return (
    <div className="site-shell">
      <motion.div className="page-progress" style={{ scaleX: progressScale }} />
      <div className="bg-grid" />
      <motion.div
        className="halo halo-one"
        animate={{ x: [0, 24, -14, 0], y: [0, -14, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="halo halo-two"
        animate={{ x: [0, -20, 16, 0], y: [0, 16, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="halo halo-three"
        animate={{ x: [0, 18, -12, 0], y: [0, -10, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.header
        className="topbar"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container topbar-inner">
          <a href="#top" className="brand mono">
            BTG // Software
          </a>
          <nav className="nav">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
            <a href="#contact" className="nav-cta">
              Hire Me
            </a>
          </nav>
        </div>
      </motion.header>

      <main className="container" id="top">
        <motion.section
          ref={heroRef}
          className="hero"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="hero-layout">
            <div>
              <motion.p className="hero-kicker mono" variants={fadeUp}>
                Open to Software Roles | 2026
              </motion.p>
              <motion.h1 className="hero-title" variants={fadeUp}>
                Bhargava Teja Reddy Guddeti
              </motion.h1>
              <motion.p className="hero-subtitle" variants={fadeUp}>
                Building production-minded software experiences with strong data
                structures fundamentals and a bias for practical execution.
              </motion.p>
              <motion.div className="hero-actions" variants={fadeUp}>
                <a href="#work" className="btn btn-primary">
                  Explore Work
                </a>
                <a href="#contact" className="btn btn-secondary">
                  Contact
                </a>
              </motion.div>
            </div>

            <motion.aside className="signal-card" style={{ y: cardY }} variants={fadeUp}>
              <p className="signal-label mono">Current Focus</p>
              <h3>Software systems that convert ideas into working products.</h3>
              <ul>
                <li>Fintech analytics workflows</li>
                <li>Healthcare platform interactions</li>
                <li>Automation-first problem solving</li>
              </ul>
              <div className="signal-tags">
                <span>Next.js</span>
                <span>Framer Motion</span>
                <span>Python</span>
                <span>SQL</span>
              </div>
            </motion.aside>
          </div>

          <motion.div className="metric-grid" variants={stagger}>
            {metrics.map((metric) => (
              <motion.article key={metric.label} className="metric-card" variants={fadeUp}>
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
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

        <motion.section
          id="work"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            kicker="Project Portfolio"
            title="Selected Software Projects"
            copy="Each project is designed around a practical workflow and measurable implementation quality."
          />

          <div className="filter-row">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-btn ${activeFilter === filter.value ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="project-slider">
            <div className="slider-nav">
              <p className="slider-meta mono">
                {filteredProjects.length
                  ? `${String(activeSlide + 1).padStart(2, "0")} / ${String(
                      filteredProjects.length
                    ).padStart(2, "0")}`
                  : "00 / 00"}
              </p>
              <div className="slider-controls">
                <button
                  type="button"
                  className="slider-btn"
                  onClick={() => changeSlide(-1)}
                  disabled={filteredProjects.length <= 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="slider-btn"
                  onClick={() => changeSlide(1)}
                  disabled={filteredProjects.length <= 1}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="project-stage">
              <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
                {currentProject ? (
                  <motion.article
                    key={`${activeFilter}-${currentProject.title}`}
                    custom={slideDirection}
                    className="project-card"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    whileHover={{ y: -5 }}
                  >
                    <div className="project-head">
                      <h3>{currentProject.title}</h3>
                      <span className="project-status mono">{currentProject.status}</span>
                    </div>
                    <p className="project-summary">{currentProject.summary}</p>
                    <p className="project-impact">{currentProject.impact}</p>
                    <div className="chip-row">
                      {currentProject.stack.map((item) => (
                        <span key={item} className="chip mono">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="project-links">
                      {currentProject.links.map((link) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                          {link.label} {"->"}
                        </a>
                      ))}
                    </div>

                    {currentProject.id === "chess" ? (
                      <div className="project-module chess-module">
                        <p className="module-label mono">Embedded Chess Demo</p>
                        <button
                          type="button"
                          className="chess-preview-trigger"
                          onClick={() => setIsChessModalOpen(true)}
                        >
                          <div className="chess-preview-board">
                            <Chessboard
                              id="preview-chess-board"
                              position={chessFen}
                              boardWidth={104}
                              arePiecesDraggable={false}
                              boardOrientation="white"
                              customDarkSquareStyle={{ backgroundColor: "#769656" }}
                              customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
                            />
                          </div>
                          <div className="chess-preview-copy">
                            <p>Play Human vs Computer</p>
                            <span>{isStockfishReady ? "Stockfish Ready" : "Stockfish Loading"}</span>
                          </div>
                        </button>
                      </div>
                    ) : null}

                    {currentProject.id === "algo-trading" ? (
                      <div className="project-module trading-module">
                        <div className="trading-head">
                          <p className="module-label mono">Live Market Analytics</p>
                          <div className="trading-controls">
                            <select
                              value={selectedTicker}
                              onChange={(event) => setSelectedTicker(event.target.value)}
                            >
                              {stockUniverse.map((stock) => (
                                <option key={stock.ticker} value={stock.ticker}>
                                  {stock.name} ({stock.ticker})
                                </option>
                              ))}
                            </select>
                            <button type="button" onClick={randomizeTicker}>
                              Randomize
                            </button>
                          </div>
                        </div>

                        {isTradingLoading ? (
                          <p className="trading-feedback">Loading Yahoo Finance data...</p>
                        ) : null}
                        {tradingError ? <p className="trading-feedback error">{tradingError}</p> : null}

                        {tradingData ? (
                          <>
                            <div className="trading-stat-grid">
                              <article>
                                <span className="mono">Ticker</span>
                                <p>
                                  {selectedStockMeta.name} ({tradingData.ticker})
                                </p>
                              </article>
                              <article>
                                <span className="mono">Spot</span>
                                <p>{toUsd(tradingData.spotPrice)}</p>
                              </article>
                              <article>
                                <span className="mono">Brownian Paths</span>
                                <p>{brownianPathCount.toLocaleString()}</p>
                              </article>
                              <article>
                                <span className="mono">Strike Range</span>
                                <p>
                                  {tradingData.strikes[0]} -{" "}
                                  {tradingData.strikes[tradingData.strikes.length - 1]}
                                </p>
                              </article>
                            </div>

                            <div className="brownian-panel">
                              <div className="brownian-head">
                                <h4>One-Year Brownian Simulation</h4>
                                <p className="mono">
                                  {brownianPathCount.toLocaleString()} lines | Human-readable expected path
                                </p>
                              </div>
                              <canvas ref={brownianCanvasRef} className="brownian-canvas" />
                            </div>

                            <div className="surface-panel">
                              <div className="surface-head">
                                <h4>3D Options Volume Surface</h4>
                                <p className="mono">
                                  Upcoming 2 months | {optionsRangePoints} points above and below spot
                                </p>
                              </div>
                              <Plot
                                data={optionsSurfaceData}
                                layout={optionsSurfaceLayout}
                                config={{
                                  displaylogo: false,
                                  responsive: true,
                                  modeBarButtonsToRemove: [
                                    "lasso2d",
                                    "select2d",
                                    "toggleSpikelines",
                                    "autoScale2d"
                                  ]
                                }}
                                style={{ width: "100%", height: "420px" }}
                                useResizeHandler
                              />
                            </div>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </motion.article>
                ) : (
                  <motion.p className="project-empty" variants={fadeUp}>
                    No project is available for the selected filter.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {filteredProjects.length > 1 ? (
              <div className="slider-dots">
                {filteredProjects.map((project, index) => (
                  <button
                    key={`${project.title}-${index}`}
                    type="button"
                    className={`slider-dot ${index === activeSlide ? "active" : ""}`}
                    onClick={() => jumpToSlide(index)}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </motion.section>

        <motion.section
          id="experience"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            kicker="Professional Experience"
            title="Experience in Software Delivery"
            copy="Professional software development experience focused on financial systems at Capri Global Capital."
          />

          <div className="experience-timeline">
            {experienceData.map((item, index) => (
              <motion.article
                key={`${item.role}-${item.organization}`}
                className="experience-entry"
                variants={fadeUp}
                whileHover={{ y: -3 }}
              >
                <div className="experience-rail" aria-hidden="true">
                  <span className="experience-dot" />
                  {index < experienceData.length - 1 ? <span className="experience-line" /> : null}
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
                    {item.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <div className="experience-tool-row">
                    {item.tools.map((tool) => (
                      <span key={tool} className="experience-tool mono">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="skills"
          className="section skills-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            kicker="Technical Competencies"
            title="Engineering Capability Across Stack Layers"
            copy="From frontend architecture to backend services and engineering delivery, this section reflects end-to-end technical breadth."
          />

          <div className="skills-theme">
            <motion.div
              className="skills-theme-glow skills-theme-glow-one"
              animate={{ x: [0, 30, -18, 0], y: [0, -20, 12, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="skills-theme-glow skills-theme-glow-two"
              animate={{ x: [0, -26, 16, 0], y: [0, 16, -10, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="skills-layout">
              {skillGroups.map((group, groupIndex) => (
                <motion.article
                  key={group.title}
                  className="skills-card"
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.015 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="skill-group-index mono">
                    {String(groupIndex + 1).padStart(2, "0")}
                  </p>
                  <h3>{group.title}</h3>
                  <p className="skill-group-summary">{group.summary}</p>
                  <div className="skill-pill-grid">
                    {group.items.map((item, itemIndex) => (
                      <motion.span
                        key={item}
                        className="skill-pill"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.32, delay: itemIndex * 0.025 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              className="tech-cloud"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="tech-cloud-title mono">Technology Stack</p>
              <div className="tech-cloud-pills">
                {technologyStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className="tech-pill mono"
                    style={{ "--float-delay": `${(index % 12) * 0.16}s` }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="education"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          <SectionTitle
            kicker="Academic Background"
            title="Educational Qualifications"
          />

          <div className="timeline">
            {education.map((item) => (
              <motion.article key={item.degree} className="timeline-item" variants={fadeUp}>
                <h3>{item.degree}</h3>
                <p className="timeline-institution">{item.institution}</p>
                <p>{item.details}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="section contact-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <SectionTitle
            kicker="Contact Information"
            title="Available for Software Engineering Opportunities"
            copy="Open to discussing software development roles across product engineering, backend, and full-stack delivery."
          />

          <div className="contact-links">
            <a href="mailto:guddeti.bhargavareddy@gmail.com">Email</a>
            <a href="https://github.com/Teja3804" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bhargava-teja-reddy-guddeti-243983228/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="https://leetcode.com/u/user5873Y/" target="_blank" rel="noreferrer">
              LeetCode
            </a>
          </div>
        </motion.section>

        <AnimatePresence>
          {isChessModalOpen ? (
            <motion.div
              className="chess-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChessModalOpen(false)}
            >
              <motion.div
                className="chess-modal"
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="chess-modal-head">
                  <div>
                    <p className="mono">Human vs Computer</p>
                    <h3>Chess Arena (White: Human, Black: Stockfish)</h3>
                  </div>
                  <button type="button" onClick={() => setIsChessModalOpen(false)}>
                    Close
                  </button>
                </div>

                <div className="chess-modal-layout">
                  <div ref={chessBoardContainerRef} className="chess-modal-board-wrap">
                    <Chessboard
                      id="main-chess-board"
                      position={chessFen}
                      boardWidth={chessBoardWidth}
                      arePiecesDraggable
                      onPieceDrop={onChessDrop}
                      boardOrientation="white"
                      customDarkSquareStyle={{ backgroundColor: "#769656" }}
                      customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
                    />
                  </div>

                  <div className="chess-modal-side">
                    <p className="chess-status">{chessStatus}</p>
                    <p className="chess-engine mono">
                      {isStockfishReady ? "Stockfish Online" : "Stockfish Offline (fallback AI active)"}
                    </p>
                    {isEngineThinking ? <p className="mono chess-engine-thinking">Engine thinking...</p> : null}

                    <div className="chess-actions">
                      <button type="button" onClick={resetChessGame}>
                        New Game
                      </button>
                    </div>

                    <div className="chess-history">
                      <h4>Move History</h4>
                      <p>{chessMoves.length ? chessMoves.join(" ") : "No moves yet."}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
