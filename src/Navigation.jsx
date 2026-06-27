import { Link } from 'react-scroll';
import './Navigation.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiFileText, FiSun, FiMoon } from 'react-icons/fi';

const RESUME_URL = "/tjindl.web/assets/resume/TjindlResumeLatest.pdf";

function Navigation() {
    const [activeSection, setActiveSection] = useState('about');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
    const [nameIdx, setNameIdx] = useState(0);

    const names = [
        { text: 'Tushar Jindal', script: 'en' },
        { text: 'तुषार जिंदल', script: 'hi' },
        { text: 'ਤੁਸ਼ਾਰ ਜਿੰਦਲ', script: 'pa' },
    ];

    useEffect(() => {
        const t = setInterval(() => setNameIdx(i => (i + 1) % 3), 2500);
        return () => clearInterval(t);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'skills', 'experience', 'projects', 'connect'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', to: 'about', index: '01' },
        { name: 'Skills', to: 'skills', index: '02' },
        { name: 'Experience', to: 'experience', index: '03' },
        { name: 'Projects', to: 'projects', index: '04' },
        { name: 'Connect', to: 'connect', index: '05' },
    ];

    return (
        <>
            <nav className="navigation desktop-only">
                <div className="nav-items">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.to;
                        return (
                            <Link
                                key={link.name}
                                to={link.to}
                                smooth={true}
                                duration={500}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="nav-index">{link.index}</span>
                                <span className="nav-label">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="nav-name-cycle desktop-only">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={nameIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="nav-name-text"
                        lang={names[nameIdx].script}
                    >
                        {names[nameIdx].text}
                    </motion.span>
                </AnimatePresence>
            </div>

            <div className="nav-corner desktop-only">
                <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-corner-link"
                >
                    <FiFileText />
                    <span>Resume</span>
                </a>
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
            </div>

            {/* Mobile nav */}
            <div className="mobile-nav-bar">
                <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="nav-items mobile">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.to;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        smooth={true}
                                        duration={500}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <span className="nav-index">{link.index}</span>
                                        <span className="nav-label">{link.name}</span>
                                    </Link>
                                );
                            })}
                            <a
                                href={RESUME_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-item"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <FiFileText style={{ marginRight: 6 }} />
                                <span className="nav-label">Resume</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navigation;
