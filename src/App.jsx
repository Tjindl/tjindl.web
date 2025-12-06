import { useEffect, useState, useRef } from 'react';
import Projects from './Projects'
import './App.css'
import img from "./img.jpeg";
import Connect from "./Connect.jsx"
import Navigation from "./Navigation.jsx"
import Skills from "./Skills.jsx"
import Magnetic from "./Magnetic.jsx"
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiEdit3 } from 'react-icons/fi';

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax Transforms
  const heroTextY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroImageY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Scramble Effect State
  const [scrambleText, setScrambleText] = useState("Full Stack Developer");
  const originalText = "Full Stack Developer";
  const scrambleChars = "!@#$%^&*()_+{}:<>?1234567890abcdef";

  const handleScramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambleText(
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return scrambleChars[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        background: `radial-gradient(600px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
      }}
    >
      <div className="noise-overlay"></div>
      <motion.div
        className="cursor-dot"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      />
      <motion.div
        className="cursor-outline"
        animate={{ left: cursorPosition.x, top: cursorPosition.y }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <Navigation />

      <main className="main">
        <section id="about" className="hero-section">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="hero-text"
            >
              <h2 className="greeting">Hello, I'm</h2>
              <h1 className="name gradient-text">
                {Array.from("Tushar Jindal").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h1>
              <h3
                className="role mono"
                onMouseEnter={handleScramble}
                style={{ cursor: 'pointer', width: 'fit-content' }}
              >
                {scrambleText}
              </h3>
              <p className="bio">
                Crafting digital experiences with code and creativity.
                Specializing in building exceptional, high-quality websites and applications.
              </p>

              <div className="hero-buttons">
                <Magnetic>
                  <motion.a
                    href="#projects"
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Work
                  </motion.a>
                </Magnetic>
                <Magnetic>
                  <motion.a
                    href="#connect"
                    className="btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Me
                  </motion.a>
                </Magnetic>
              </div>

              <div className="social-links">
                <Magnetic>
                  <a href="https://github.com/tjindl" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FiGithub />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="https://linkedin.com/in/tushar-jindal-97602420b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="https://medium.com/@tushar.bzp05" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                    <FiEdit3 />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="mailto:tushar.bzp05@gmail.com" aria-label="Email">
                    <FiMail />
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            <motion.div
              className="hero-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ y: heroImageY, opacity: heroOpacity }}
            >
              <div className="image-wrapper">
                <img src={img} alt="Tushar Jindal" />
                <div className="glow-effect"></div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="projects-section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="gradient-text">Featured Projects</h2>
            <p>A selection of my recent work</p>
          </motion.div>
          <Projects />
        </section>

        <section id="skills" className="skills-section">
          <Skills />
        </section>

        <section id="connect" className="connect-section">
          <div className="connect-container">
            <Connect />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;