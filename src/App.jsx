import { useEffect, useState } from 'react';
import Projects from './Projects'
import './App.css'
import img from "./img.jpeg";
import Connect from "./Connect.jsx"
import Navigation from "./Navigation.jsx"
import Skills from "./Skills.jsx"
import Magnetic from "./Magnetic.jsx"
import FloatingResume from "./FloatingResume.jsx"
import LoadingScreen from "./components/LoadingScreen.jsx"
import Footer from "./components/Footer.jsx"
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';
import Experience from './Experience';
import { FiGithub, FiLinkedin, FiMail, FiEdit3 } from 'react-icons/fi';
import HeroImage from './HeroImage';

function App() {
  // ... (imports and component setup)


  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Optimized Cursor with useMotionValue (No re-renders)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  const { scrollY } = useScroll();

  // Parallax Transforms
  const heroTextY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroImageY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="App">
          <motion.div
            className="scroll-progress-bar"
            style={{ scaleX }}
          />
          <div className="noise-overlay"></div>

          {/* Optimized Cursor */}
          <motion.div
            className="cursor-dot"
            style={{
              translateX: "-50%",
              translateY: "-50%",
              x: cursorX,
              y: cursorY
            }}
          />
          <motion.div
            className="cursor-outline"
            style={{
              translateX: "-50%",
              translateY: "-50%",
              x: cursorXSpring,
              y: cursorYSpring
            }}
          />

          <Navigation />

          <main className="main">
            <section id="about" className="hero-section">
              <div className="hero-content">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ y: heroTextY, opacity: heroOpacity }}
                  className="hero-text"
                >
                  <motion.h2
                    className="greeting"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Hello, I'm
                  </motion.h2>
                  <motion.h1
                    className="name gradient-text"
                    initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    Tushar Jindal
                  </motion.h1>
                  <motion.h3
                    className="role mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    Full Stack Developer
                  </motion.h3>
                  <motion.p
                    className="bio"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Crafting digital experiences with code and creativity.
                    Specializing in building exceptional, high-quality websites and applications.
                  </motion.p>

                  <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
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
                  </motion.div>

                  <motion.div
                    className="social-links"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
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
                  </motion.div>
                </motion.div>

                <motion.div
                  className="hero-image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  style={{ y: heroImageY, opacity: heroOpacity }}
                >
                  <HeroImage />
                </motion.div>
              </div>
            </section>

            <section id="skills" className="skills-section">
              <Skills />
            </section>

            <section id="experience" className="experience-section">
              <Experience />
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

            <section id="connect" className="connect-section">
              <div className="connect-container">
                <Connect />
              </div>
            </section>

            <Footer />
            <FloatingResume />
          </main>
        </div>
      )}
    </>
  );
}

export default App;