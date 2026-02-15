"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" }
];

const metrics = [
  { value: "4+", label: "End-to-end projects built" },
  { value: "2", label: "Engineering degrees completed" },
  { value: "3", label: "Core domains: finance, health, systems" }
];

const projectData = [
  {
    title: "Mutual Funds Investment App",
    status: "Shipped",
    summary:
      "Portfolio tracking and performance analytics with a practical data layer for investment decision support.",
    stack: ["Python", "SQL", "JavaScript", "Analytics"],
    impact: "Designed for day-to-day portfolio visibility and easier performance breakdowns.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/asset-reddy" }]
  },
  {
    title: "Interactive Chess Game",
    status: "Shipped",
    summary:
      "A clean browser chess experience focused on gameplay flow, move handling, and user-friendly controls.",
    stack: ["JavaScript", "HTML", "CSS", "Game Logic"],
    impact: "Built to demonstrate frontend engineering and state-driven interactions.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/chesssunreddy" }]
  },
  {
    title: "Patient Portal System",
    status: "In Progress",
    summary:
      "Healthcare workflow platform for appointments, doctor-patient communication, and structured records.",
    stack: ["Python", "SQL", "JavaScript", "Healthcare"],
    impact: "Aims to reduce friction in patient communication and care coordination.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }]
  },
  {
    title: "Algorithmic Trading Platform",
    status: "In Progress",
    summary:
      "Strategy execution workspace with market analysis, testing loops, and automation-oriented architecture.",
    stack: ["Python", "Quant", "DSA", "Automation"],
    impact: "Focused on disciplined system design for repeatable strategy experimentation.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }]
  }
];

const skillGroups = [
  {
    title: "Programming",
    items: [
      { name: "Python", level: 92 },
      { name: "JavaScript", level: 86 },
      { name: "C++", level: 80 },
      { name: "SQL", level: 84 }
    ]
  },
  {
    title: "Engineering Core",
    items: [
      { name: "Data Structures", level: 90 },
      { name: "Algorithms", level: 88 },
      { name: "System Thinking", level: 82 },
      { name: "Problem Solving", level: 93 }
    ]
  },
  {
    title: "Product Execution",
    items: [
      { name: "API + Backend Flow", level: 85 },
      { name: "UI Implementation", level: 81 },
      { name: "Domain Modeling", level: 83 },
      { name: "Delivery Focus", level: 90 }
    ]
  }
];

const education = [
  {
    degree: "Master of Information Systems",
    institution: "Saint Louis University, Saint Louis, Missouri",
    period: "2024-2025",
    details:
      "Advanced work in information systems, software development, and business-aligned technical solutions."
  },
  {
    degree: "Bachelor of Engineering",
    institution: "NIT Rourkela, India",
    period: "2019-2023",
    details:
      "Strong analytical foundation that now drives practical software engineering and structured execution."
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

const marqueeText =
  "NEXT.JS  FRAMER MOTION  PYTHON  JAVASCRIPT  SQL  DATA STRUCTURES  PRODUCT MINDSET  FINTECH  HEALTHCARE SYSTEMS  ALGORITHMIC THINKING";

function SectionTitle({ kicker, title, copy }) {
  return (
    <div className="section-title">
      <p className="kicker mono">{kicker}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectData;
    return projectData.filter((project) => project.status.toLowerCase() === activeFilter);
  }, [activeFilter]);

  return (
    <div className="site-shell">
      <div className="bg-grid" />
      <div className="halo halo-one" />
      <div className="halo halo-two" />
      <div className="halo halo-three" />

      <header className="topbar">
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
      </header>

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
            kicker="Selected Work"
            title="Project portfolio with real product intent"
            copy="Each build is scoped around solving an actual workflow rather than only showcasing UI."
          />

          <div className="filter-row">
            {["all", "shipped", "in progress"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.title}
                className="project-card"
                variants={fadeUp}
                whileHover={{ y: -7 }}
              >
                <div className="project-head">
                  <h3>{project.title}</h3>
                  <span className="project-status mono">{project.status}</span>
                </div>
                <p className="project-summary">{project.summary}</p>
                <p className="project-impact">{project.impact}</p>
                <div className="chip-row">
                  {project.stack.map((item) => (
                    <span key={item} className="chip mono">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.links.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} {"->"}
                    </a>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="skills"
          className="section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            kicker="Technical Radar"
            title="Execution strength across stack layers"
            copy="From algorithmic thinking to product implementation, this is the capability mix I bring."
          />

          <div className="skills-layout">
            {skillGroups.map((group) => (
              <motion.article key={group.title} className="skills-card" variants={fadeUp}>
                <h3>{group.title}</h3>
                <div className="skill-rows">
                  {group.items.map((item) => (
                    <div key={item.name} className="skill-row">
                      <div className="skill-topline">
                        <span>{item.name}</span>
                        <span className="mono">{item.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <motion.div
                          className="skill-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.9] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
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
            kicker="Education"
            title="Foundation behind the engineering style"
          />

          <div className="timeline">
            {education.map((item) => (
              <motion.article key={item.degree} className="timeline-item" variants={fadeUp}>
                <p className="timeline-period mono">{item.period}</p>
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
            kicker="Let's Connect"
            title="Ready to contribute to a strong engineering team"
            copy="If you are hiring for software development, I am open to discussing product, backend, and full-stack roles."
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
      </main>
    </div>
  );
}
