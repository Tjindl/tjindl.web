import { Link } from 'react-scroll';
import './Navigation.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

function Navigation() {
    const [activeSection, setActiveSection] = useState('about');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

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
        { name: 'About', to: 'about' },
        { name: 'Skills', to: 'skills' },
        { name: 'Experience', to: 'experience' },
        { name: 'Projects', to: 'projects' },
        { name: 'Connect', to: 'connect' },
    ];

    return (
        <motion.nav
            className={`navigation ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-content">
                <Link to="about" smooth={true} duration={500} className="nav-brand">
                    <span className="gradient-text">TJ</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="nav-links desktop-only">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.to}
                                smooth={true}
                                duration={500}
                                className={`nav-link ${activeSection === link.to ? 'active' : ''}`}
                            >
                                <span className="nav-text">{link.name}</span>
                                {activeSection === link.to && (
                                    <motion.div
                                        className="active-indicator"
                                        layoutId="activeIndicator"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30
                                        }}
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="nav-controls">
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <ul>
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.to}
                                        smooth={true}
                                        duration={500}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={activeSection === link.to ? 'active' : ''}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navigation;
