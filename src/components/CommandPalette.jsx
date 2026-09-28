import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiHash, FiFolder, FiCopy, FiCheck, FiMoon, FiSun, FiFileText, FiArrowUpRight, FiBookOpen,
} from 'react-icons/fi';
import Data from '../Data';
import { posts, hasWriting } from '../blog/posts';
import { navLinks, RESUME_URL, EMAIL, SOCIAL_LINKS, isMac } from '../site';
import { copyToClipboard } from '../clipboard';
import './CommandPalette.css';

const GROUP_ORDER = ['Go to', 'Writing', 'Projects', 'Actions', 'Links'];

const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

function buildCommands({ theme, onToggleTheme, goToSection, navigate }) {
    return [
        ...navLinks.map((link) => ({
            id: `nav-${link.to}`,
            group: 'Go to',
            label: link.name,
            hint: link.index,
            icon: FiHash,
            run: () => goToSection(link.to),
        })),
        ...(hasWriting ? [{
            id: 'nav-blog',
            group: 'Go to',
            label: 'All writing',
            keywords: 'blog posts articles',
            icon: FiBookOpen,
            run: () => navigate('/blog'),
        }] : []),
        ...posts.map((post) => ({
            id: `post-${post.slug ?? post.url}`,
            group: 'Writing',
            label: post.title,
            sub: post.summary,
            keywords: post.tags.join(' '),
            icon: post.external ? FiArrowUpRight : FiBookOpen,
            hint: post.external ? post.source : `${post.readingTime} min`,
            run: () => (post.external ? openInNewTab(post.url) : navigate(`/blog/${post.slug}`)),
        })),
        {
            id: 'nav-julia',
            group: 'Go to',
            label: 'Fig. 1 — Julia set',
            keywords: 'math maths fractal julia mandelbrot complex figure',
            hint: '∑',
            icon: FiHash,
            run: () => goToSection('fig-julia'),
        },
        ...Data.map((project) => ({
            id: `project-${project.name}`,
            group: 'Projects',
            label: project.name,
            sub: project.tagline,
            keywords: project.tech.join(' '),
            icon: FiFolder,
            hint: project.featured ? 'featured' : undefined,
            run: () => openInNewTab(project.link || project.live),
        })),
        {
            id: 'copy-email',
            group: 'Actions',
            label: 'Copy email address',
            sub: EMAIL,
            icon: FiCopy,
            run: () => copyToClipboard(EMAIL),
            confirm: 'Copied',
        },
        {
            id: 'theme',
            group: 'Actions',
            label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
            keywords: 'dark light mode appearance',
            icon: theme === 'dark' ? FiSun : FiMoon,
            run: onToggleTheme,
            afterClose: true,
        },
        {
            id: 'resume',
            group: 'Actions',
            label: 'Open resume',
            keywords: 'cv pdf',
            icon: FiFileText,
            run: () => openInNewTab(RESUME_URL),
        },
        ...SOCIAL_LINKS.map((link) => ({
            id: `link-${link.label}`,
            group: 'Links',
            label: link.label,
            sub: link.value,
            icon: FiArrowUpRight,
            run: () => openInNewTab(link.href),
        })),
    ];
}

// Every whitespace-separated query term must appear somewhere in the command's text.
function filterCommands(commands, query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    const q = terms.join(' ');
    return commands
        .filter((cmd) => {
            const haystack = `${cmd.label} ${cmd.sub ?? ''} ${cmd.keywords ?? ''} ${cmd.group}`.toLowerCase();
            return terms.every((term) => haystack.includes(term));
        })
        .sort((a, b) => Number(!a.label.toLowerCase().startsWith(q)) - Number(!b.label.toLowerCase().startsWith(q)));
}

function CommandPalette({ open, setOpen, theme, onToggleTheme }) {
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const [confirmed, setConfirmed] = useState(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const returnFocusRef = useRef(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const commands = useMemo(() => {
        // Home sections scroll in place on the home page; elsewhere, go home first.
        const goToSection = (id) => {
            if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            else navigate(`/#${id}`);
        };
        return buildCommands({ theme, onToggleTheme, goToSection, navigate });
    }, [theme, onToggleTheme, pathname, navigate]);
    const results = useMemo(() => {
        const filtered = filterCommands(commands, query);
        // Keep results grouped, in a fixed group order, so the list reads predictably.
        return GROUP_ORDER.flatMap((group) => filtered.filter((cmd) => cmd.group === group));
    }, [commands, query]);

    // Global ⌘K / Ctrl+K toggle.
    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [setOpen]);

    // Reset on open, lock page scroll, and hand focus back when closing.
    useEffect(() => {
        if (!open) return;
        returnFocusRef.current = document.activeElement;
        setQuery('');
        setActive(0);
        setConfirmed(null);
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
            returnFocusRef.current?.focus?.();
        };
    }, [open]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const run = async (cmd) => {
        if (!cmd) return;
        if (cmd.confirm) {
            await cmd.run();
            setConfirmed(cmd.id);
            setTimeout(() => setOpen(false), 650);
            return;
        }
        setOpen(false);
        // Let the palette finish closing first so it isn't captured in the theme transition.
        if (cmd.afterClose) setTimeout(cmd.run, 180);
        else cmd.run();
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % Math.max(results.length, 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            run(results[active]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    };

    let lastGroup = null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="palette-overlay"
                    onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <motion.div
                        className="palette"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command palette"
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -4 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="palette-search">
                            <FiSearch aria-hidden="true" />
                            <input
                                ref={inputRef}
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Search or jump to…"
                                aria-label="Search commands"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="palette-list"
                                aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
                            />
                            <kbd>esc</kbd>
                        </div>

                        <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
                            {results.length === 0 && (
                                <li className="palette-empty">No results for “{query}”</li>
                            )}
                            {results.map((cmd, i) => {
                                const showGroup = cmd.group !== lastGroup;
                                lastGroup = cmd.group;
                                const Icon = confirmed === cmd.id ? FiCheck : cmd.icon;
                                return (
                                    <li key={cmd.id} role="presentation">
                                        {showGroup && <div className="palette-group">{cmd.group}</div>}
                                        <div
                                            id={`palette-${cmd.id}`}
                                            role="option"
                                            aria-selected={i === active}
                                            className="palette-item"
                                            onMouseMove={() => i !== active && setActive(i)}
                                            onClick={() => run(cmd)}
                                        >
                                            <Icon className="palette-icon" aria-hidden="true" />
                                            <span className="palette-text">
                                                <span className="palette-label">{cmd.label}</span>
                                                {cmd.sub && <span className="palette-sub">{cmd.sub}</span>}
                                            </span>
                                            <span className="palette-hint">
                                                {confirmed === cmd.id ? cmd.confirm : cmd.hint}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="palette-footer" aria-hidden="true">
                            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                            <span><kbd>↵</kbd> open</span>
                            <span><kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd> toggle</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
