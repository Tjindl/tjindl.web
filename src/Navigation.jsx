import { Link as ScrollLink } from 'react-scroll';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiFileText, FiSun, FiMoon, FiSearch, FiBookOpen } from 'react-icons/fi';
import { RESUME_URL, navLinks, isMac } from './site';
import { hasWriting } from './blog/posts';
import CommandPalette from './components/CommandPalette.jsx';

// Links shown in the rail away from the home page.
const pageLinks = [
    { name: 'Home', to: '/', index: '01' },
    ...(hasWriting ? [{ name: 'Writing', to: '/blog', index: '02' }] : []),
];

function Navigation() {
    const { pathname } = useLocation();
    const onHome = pathname === '/';
    // Post pages draw their own rail with the post's table of contents.
    const onPost = pathname.startsWith('/blog/');
    const [activeSection, setActiveSection] = useState('about');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
    const [nameIdx, setNameIdx] = useState(0);
    const [paletteOpen, setPaletteOpen] = useState(false);

    const names = [
        { text: 'Tushar Jindal', script: 'en' },
        { text: 'तुषार जिंदल', script: 'hi' },
        { text: 'ਤੁਸ਼ਾਰ ਜਿੰਦਲ', script: 'pa' },
    ];

    useEffect(() => {
        const t = setInterval(() => setNameIdx(i => (i + 1) % 3), 2500);
        return () => clearInterval(t);
    }, []);

    // `origin` is the element the reveal circle grows from; defaults to the viewport centre.
    const toggleTheme = useCallback((origin) => {
        const next = theme === 'dark' ? 'light' : 'dark';
        const apply = () => {
            flushSync(() => setTheme(next));
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        };

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || reduceMotion) {
            apply();
            return;
        }

        // Reveal the new theme as a circle growing out of the origin.
        const rect = origin?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        document.startViewTransition(apply).ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 550, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
            );
        });
    }, [theme]);

    useEffect(() => setIsMobileOpen(false), [pathname]);

    useEffect(() => {
        if (!onHome) return undefined;
        // Active = the last section whose top has passed the upper third of the viewport,
        // or the last section once the page is scrolled to the bottom.
        const handleScroll = () => {
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) {
                setActiveSection(navLinks[navLinks.length - 1].to);
                return;
            }

            const line = window.innerHeight * 0.35;
            let current = navLinks[0].to;
            for (const { to } of navLinks) {
                const element = document.getElementById(to);
                if (element && element.getBoundingClientRect().top <= line) {
                    current = to;
                }
            }
            setActiveSection(current);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onHome]);

    const sectionLink = (link, onClick) => (
        <ScrollLink
            key={link.name}
            to={link.to}
            smooth={true}
            duration={500}
            onClick={onClick}
            className={`nav-item ${activeSection === link.to ? 'active' : ''}`}
        >
            <span className="nav-index">{link.index}</span>
            <span className="nav-label">{link.name}</span>
        </ScrollLink>
    );

    const pageLink = (link) => (
        <Link
            key={link.name}
            to={link.to}
            className={`nav-item ${pathname === link.to ? 'active' : ''}`}
        >
            <span className="nav-index">{link.index}</span>
            <span className="nav-label">{link.name}</span>
        </Link>
    );

    return (
        <>
            {!onPost && <div className="nav-rail desktop-only">
                <nav className="navigation">
                    <div className="nav-items">
                        {onHome ? navLinks.map((link) => sectionLink(link)) : pageLinks.map(pageLink)}
                    </div>
                </nav>

                <div className="nav-name-cycle">
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
            </div>}

            <div className="nav-corner desktop-only">
                <button
                    type="button"
                    className="palette-trigger"
                    onClick={() => setPaletteOpen(true)}
                    aria-label="Open command palette"
                >
                    <FiSearch aria-hidden="true" />
                    <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
                </button>
                {hasWriting && (
                    <Link to="/blog" className="resume-corner-link">
                        <FiBookOpen />
                        <span>Writing</span>
                    </Link>
                )}
                <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-corner-link"
                >
                    <FiFileText />
                    <span>Resume</span>
                </a>
                <button className="theme-toggle" onClick={(e) => toggleTheme(e.currentTarget)} aria-label="Toggle theme">
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
            </div>

            {/* Mobile nav */}
            <div className="mobile-nav-bar">
                {onHome ? (
                    <ScrollLink to="about" smooth={true} duration={500} className="mobile-brand">Tushar Jindal</ScrollLink>
                ) : (
                    <Link to="/" className="mobile-brand">Tushar Jindal</Link>
                )}
                <button className="theme-toggle" onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
                    <FiSearch />
                </button>
                <button className="theme-toggle" onClick={(e) => toggleTheme(e.currentTarget)} aria-label="Toggle theme">
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
                            {onHome
                                ? navLinks.map((link) => sectionLink(link, () => setIsMobileOpen(false)))
                                : pageLinks.map(pageLink)}
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

            <CommandPalette
                open={paletteOpen}
                setOpen={setPaletteOpen}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        </>
    );
}

export default Navigation;
