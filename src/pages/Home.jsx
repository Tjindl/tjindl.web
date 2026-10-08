import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiEdit3, FiFileText, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import Footer from '../components/Footer.jsx';
import NeuralBackground from '../components/NeuralBackground.jsx';
import JuliaFigure from '../components/JuliaFigure.jsx';
import Connect from '../Connect.jsx';
import OpenSource from '../OpenSource.jsx';
import Projects from '../Projects';
import Experience, { Education } from '../Experience';
import Skills from '../Skills.jsx';
import { RESUME_URL, navLinks } from '../site';
import { posts, hasWriting } from '../blog/posts';
import PostRow from '../components/PostRow.jsx';
import SectionNav from '../components/SectionNav.jsx';
import NameCycle from '../components/NameCycle.jsx';
import Highlights from '../components/Highlights.jsx';
import useDocumentTitle from '../useDocumentTitle';

const LATEST_COUNT = 3;

// *word* marks an accent (italic, primary colour) in the About statement.
const aboutStatement =
  "I'm a Data Science and Mathematics double major at UBC, graduating in 2028, and I *learn* *by* *building.* Since 2023 that's meant tutoring math and programming, shipping production bots as an intern, getting contributions merged into NVIDIA's cuDF, and now leading web development for UBC's Science Undergraduate Society. I'm most interested in where *statistical* *rigour* meets *real-world* *engineering* *constraints.*";

// Hovered letters take each accent in turn.
const LETTER_ACCENTS = ['var(--primary)', 'var(--rose)', 'var(--teal)', 'var(--amber)'];

// Each letter rises in from a blur on load and turns italic on hover.
function AnimatedName({ text }) {
  let letterIndex = 0;
  return (
    <h1 className="name" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span className="name-word" key={w} aria-hidden="true">
          {word.split('').map((char) => {
            const i = letterIndex++;
            return (
              <motion.span
                key={i}
                className="name-letter-wrap"
                initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="name-letter" style={{ '--letter-accent': LETTER_ACCENTS[i % LETTER_ACCENTS.length] }}>
                  {char}
                </span>
              </motion.span>
            );
          })}
          {w < text.split(' ').length - 1 && ' '}
        </span>
      ))}
    </h1>
  );
}

// Words brighten one by one as the paragraph scrolls through the viewport.
function RevealText({ text }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.6'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className="about-statement">
      {words.map((raw, i) => {
        const accent = raw.startsWith('*');
        const word = raw.replaceAll('*', '');
        const range = [i / words.length, (i + 1) / words.length];
        return (
          <RevealWord key={i} progress={scrollYProgress} range={range} accent={accent} still={reduceMotion}>
            {word}
          </RevealWord>
        );
      })}
    </p>
  );
}

function RevealWord({ children, progress, range, accent, still }) {
  // Unrevealed words stay legible (not ghosted) so a quick skim still reads the whole paragraph.
  const opacity = useTransform(progress, range, [0.32, 1]);
  return (
    <>
      <motion.span className={accent ? 'about-accent' : undefined} style={still ? undefined : { opacity }}>
        {children}
      </motion.span>{' '}
    </>
  );
}

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Section({ id, title, subtitle, children }) {
  const index = navLinks.find((link) => link.to === id)?.index;
  return (
    <motion.section
      id={id}
      className="profile-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <header className="section-header">
        {index && <span className="section-index">{index}</span>}
        <h2 className="section-title">{title}</h2>
        <span className="section-rule" aria-hidden="true" />
      </header>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {children}
    </motion.section>
  );
}

function Home() {
  useDocumentTitle(null);

  return (
    <>
      <NeuralBackground />

      {/* Wide screens: the intro stays pinned on the left while the sections scroll past */}
      <div className="home-layout">
        <motion.header
          className="intro"
          variants={heroStagger}
          initial="hidden"
          animate="show"
        >
          <div className="intro-main">
            <motion.p className="byline" variants={heroItem}>
              ML Engineer · Data Science & Math at UBC
            </motion.p>
            <AnimatedName text="Tushar Jindal" />
            <motion.p className="hero-headline" variants={heroItem}>
              I build machine learning systems, from computer vision pipelines to LLM
              inference engines, and contribute to open-source ML infrastructure
              like <strong>NVIDIA cuDF</strong>, <strong>Dynamo</strong>, and <strong>vLLM</strong>.
            </motion.p>
            <motion.p className="hero-now" variants={heroItem}>
              <span className="hero-now-dot" aria-hidden="true" />
              Currently Web Development Chair at the Science Undergraduate Society, UBC
            </motion.p>

            <motion.div className="hero-actions" variants={heroItem}>
              <a className="btn btn-primary" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                <FiFileText /> Resume
              </a>
              <a className="btn btn-ghost" href="mailto:tushar.bzp05@gmail.com">
                Email me <FiArrowUpRight />
              </a>

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
          </div>

          <motion.div className="intro-aside" variants={heroItem}>
            <SectionNav className="intro-nav" />
            <NameCycle />
          </motion.div>
        </motion.header>

        <main className="home-content">
          <Section id="about" title="About">
            <RevealText text={aboutStatement} />
            <Highlights />
            <JuliaFigure />
          </Section>

          <Section id="opensource" title="Open Source" subtitle="Contributions to production codebases used in industry.">
            <OpenSource />
          </Section>

          <Section id="projects" title="Projects">
            <Projects />
          </Section>

          {hasWriting && (
            <Section id="writing" title="Writing">
              <div className="post-list">
                {posts.slice(0, LATEST_COUNT).map((post) => (
                  <PostRow key={post.slug ?? post.url} post={post} />
                ))}
              </div>
              <Link className="all-writing" to="/blog">
                All writing <FiArrowRight aria-hidden="true" />
              </Link>
            </Section>
          )}

          <Section id="experience" title="Experience">
            <Experience />
          </Section>

          <Section id="education" title="Education">
            <Education />
          </Section>

          <Section id="skills" title="Skills">
            <Skills />
          </Section>

          <Section id="connect" title="Connect">
            <Connect />
          </Section>

          <Footer />
        </main>
      </div>
    </>
  );
}

export default Home;
