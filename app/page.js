"use client";

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

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
    title: "Selected Stocks Short-Term Investment Platform",
    status: "Shipped",
    summary:
      "Portfolio tracking and performance analytics with a practical data layer for investment decision support.",
    stack: ["Python", "SQL", "JavaScript", "Analytics"],
    impact: "Designed for day-to-day portfolio visibility and easier performance breakdowns.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/TheInterstingGame" }]
  },
  {
    title: "Interactive Chess Application",
    status: "Shipped",
    summary:
      "A clean browser chess experience focused on gameplay flow, move handling, and user-friendly controls.",
    stack: ["JavaScript", "HTML", "CSS", "Game Logic"],
    impact: "Built to demonstrate frontend engineering and state-driven interactions.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/chesssunreddy" }]
  },
  {
    title: "Patient Portal Management System",
    status: "In Progress",
    summary:
      "Healthcare workflow platform for appointments, doctor-patient communication, and structured records.",
    stack: ["Python", "SQL", "JavaScript", "Healthcare"],
    impact: "Aims to reduce friction in patient communication and care coordination.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804" }]
  },
  {
    title: "Algorithmic Trading Strategy Platform",
    status: "In Progress",
    summary:
      "Strategy execution workspace with market analysis, testing loops, and automation-oriented architecture.",
    stack: ["Python", "Quant", "DSA", "Automation"],
    impact: "Focused on disciplined system design for repeatable strategy experimentation.",
    links: [{ label: "GitHub", href: "https://github.com/Teja3804/BrowmianSimulation" }]
  }
];

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

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectData;
    return projectData.filter((project) => project.status.toLowerCase() === activeFilter);
  }, [activeFilter]);

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
    if (filteredProjects.length <= 1) return;
    const intervalId = setInterval(() => {
      setSlideDirection(1);
      setActiveSlide((prev) => (prev + 1) % filteredProjects.length);
    }, 5200);

    return () => clearInterval(intervalId);
  }, [filteredProjects.length]);

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
      </main>
    </div>
  );
}
