import { lazy, Suspense } from 'react';
import { useState } from 'react';
import LoadingScreen from "./components/LoadingScreen.jsx"
import Footer from "./components/Footer.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import ParallaxBackground from "./components/NeuralBackground.jsx"
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import './App.css'

import Connect from "./Connect.jsx"
import Navigation from "./Navigation.jsx"
import CocWidget from "./components/CocWidget.jsx"
import { FiGithub, FiLinkedin, FiMail, FiEdit3 } from 'react-icons/fi';

const Projects = lazy(() => import('./Projects'));
const Experience = lazy(() => import('./Experience'));
const Education = lazy(() => import('./Experience').then((m) => ({ default: m.Education })));
const Skills = lazy(() => import('./Skills.jsx'));

const aboutBullets = [
  "Data Science student at UBC, graduating 2028 — statistical modeling, machine learning, and large-scale data analysis",
  "Building end-to-end ML systems, from computer vision pipelines to LLM inference engines",
  "Comfortable across the stack: production full-stack apps, APIs, and infra",
  "Most interested in where statistical rigour meets real-world engineering constraints",
];

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <MotionConfig reducedMotion="user">
        <div className="App">
          <ParallaxBackground />
          <Navigation />

          <main className="main">
            <header className="profile-header">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h1 className="name">Tushar Jindal</h1>
                <p className="byline">ML Engineer & Computer Vision — Data Science student at UBC</p>

                <div className="social-links">
                  <a href="https://github.com/tjindl" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FiGithub />
                  </a>
                  <a href="https://linkedin.com/in/tushar-jindal-97602420b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                  <a href="https://medium.com/@tushar.bzp05" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                    <FiEdit3 />
                  </a>
                  <a href="mailto:tushar.bzp05@gmail.com" aria-label="Email">
                    <FiMail />
                  </a>
                </div>
              </motion.div>
            </header>

            <motion.section
              id="about"
              className="profile-section"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="section-title">About</h2>
              <ul className="about-list">
                {aboutBullets.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </motion.section>

            <Suspense fallback={<div className="section-loader">Loading...</div>}>
              <motion.section
                id="skills"
                className="profile-section"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="section-title">Skills</h2>
                <Skills />
              </motion.section>

              <motion.section
                id="experience"
                className="profile-section"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="section-title">Experience</h2>
                <Experience />
              </motion.section>

              <motion.section
                className="profile-section"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="section-title">Education</h2>
                <Education />
              </motion.section>

              <motion.section
                id="projects"
                className="profile-section"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="section-title">Projects</h2>
                <Projects />
              </motion.section>
            </Suspense>

            <motion.section
              id="connect"
              className="profile-section"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="section-title">Connect</h2>
              <Connect />
            </motion.section>

            <motion.section
              id="fun"
              className="profile-section"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="section-title">Beyond the IDE</h2>
              <p className="section-subtitle">Outside of code — I play Clash of Clans. Here&apos;s the live data.</p>
              <CocWidget />
            </motion.section>

            <Footer />
            <ScrollToTop />
          </main>
        </div>
        </MotionConfig>
      )}
    </>
  );
}

export default App;
