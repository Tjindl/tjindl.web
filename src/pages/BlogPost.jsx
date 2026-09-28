import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiLink } from 'react-icons/fi';
import 'katex/dist/katex.min.css';
import Footer from '../components/Footer.jsx';
import NotFound from './NotFound.jsx';
import { getPost, readablePosts, formatDate } from '../blog/posts';
import { copyToClipboard } from '../clipboard';
import useDocumentTitle from '../useDocumentTitle';
import './Blog.css';

const BASE = import.meta.env.BASE_URL;

// Highlights the last heading that has scrolled past the top third of the viewport.
function useActiveHeading(toc) {
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        if (!toc?.length) return undefined;
        const onScroll = () => {
            let current = toc[0].id;
            for (const { id } of toc) {
                const heading = document.getElementById(id);
                if (heading && heading.getBoundingClientRect().top <= window.innerHeight * 0.3) current = id;
            }
            setActiveId(current);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [toc]);

    return activeId;
}

function BlogPost() {
    const { slug } = useParams();
    const { hash } = useLocation();
    const navigate = useNavigate();
    const meta = getPost(slug);
    const [post, setPost] = useState(null);
    const [linkCopied, setLinkCopied] = useState(false);
    const activeId = useActiveHeading(post?.toc);
    const tocRef = useRef(null);
    useDocumentTitle(meta ? meta.title : 'Not found');

    // Long contents lists scroll inside the rail; keep the current heading centred in view.
    useEffect(() => {
        const rail = tocRef.current;
        const item = rail?.querySelector('.nav-item.active');
        if (rail && item && rail.scrollHeight > rail.clientHeight) {
            rail.scrollTo({ top: item.offsetTop - rail.clientHeight / 2, behavior: 'smooth' });
        }
    }, [activeId]);

    useEffect(() => {
        if (!meta) return undefined;
        let cancelled = false;
        setPost(null);
        meta.load().then((full) => {
            if (!cancelled) setPost(full);
        });
        return () => {
            cancelled = true;
        };
    }, [meta]);

    // The body loads after the route renders, so honour #heading links once it arrives.
    useEffect(() => {
        if (post && hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    }, [post, hash]);

    if (!meta) return <NotFound />;

    const index = readablePosts.findIndex((p) => p.slug === slug);
    const newer = readablePosts[index - 1];
    const older = readablePosts[index + 1];

    const copyLink = async () => {
        if (await copyToClipboard(window.location.href.split('#')[0])) {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    // The article is pre-rendered HTML, so its interactions are handled by delegation.
    const onArticleClick = async (e) => {
        const copyButton = e.target.closest('.code-copy');
        if (copyButton) {
            const code = copyButton.parentElement.querySelector('code')?.innerText ?? '';
            if (await copyToClipboard(code)) {
                copyButton.textContent = 'Copied';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 1500);
            }
            return;
        }

        // Links to other pages on this site navigate without a full reload.
        const link = e.target.closest('a');
        if (!link || link.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const url = new URL(link.href, window.location.href);
        const samePage = url.pathname === window.location.pathname;
        if (url.origin === window.location.origin && url.pathname.startsWith(BASE) && !samePage) {
            e.preventDefault();
            navigate(url.pathname.slice(BASE.length - 1) + url.hash);
        }
    };

    return (
        <>
            <aside className="nav-rail desktop-only post-toc" aria-label="Contents" ref={tocRef}>
                <nav className="navigation">
                    <div className="nav-items">
                        <Link to="/blog" className="nav-item">
                            <span className="nav-index"><FiArrowLeft aria-hidden="true" /></span>
                            <span className="nav-label">Writing</span>
                        </Link>
                        {post?.toc.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`nav-item toc-level-${item.level} ${activeId === item.id ? 'active' : ''}`}
                            >
                                <span className="nav-label">{item.title}</span>
                            </a>
                        ))}
                    </div>
                </nav>
            </aside>

            <main className="main post">
                <motion.header
                    className="post-header"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <Link to="/blog" className="post-back">
                        <FiArrowLeft aria-hidden="true" /> All writing
                    </Link>
                    <h1 className="post-title">{meta.title}</h1>
                    {meta.summary && <p className="post-summary">{meta.summary}</p>}
                    <p className="post-meta">
                        <time dateTime={meta.date}>
                            {formatDate(meta.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </time>
                        <span>{meta.readingTime} min read</span>
                        {meta.original && (
                            <a className="post-original" href={meta.original.url} target="_blank" rel="noopener noreferrer">
                                Originally on {meta.original.source} <FiArrowUpRight aria-hidden="true" />
                            </a>
                        )}
                        {meta.tags.map((tag) => <span className="post-tag" key={tag}>{tag}</span>)}
                        {meta.draft && <span className="post-draft">draft</span>}
                    </p>
                </motion.header>

                {post ? (
                    <article
                        className="prose"
                        onClick={onArticleClick}
                        dangerouslySetInnerHTML={{ __html: post.html }}
                    />
                ) : (
                    <div className="prose-loading" aria-busy="true" />
                )}

                {meta.original && (
                    <p className="post-original-note">
                        First published on{' '}
                        <a href={meta.original.url} target="_blank" rel="noopener noreferrer">
                            {meta.original.source} <FiArrowUpRight aria-hidden="true" />
                        </a>
                        , where you can also leave a comment.
                    </p>
                )}

                <footer className="post-end">
                    <span className="post-end-mark" title="Q.E.D.">∎</span>
                    <button type="button" className="copy-link" onClick={copyLink}>
                        {linkCopied ? <FiCheck aria-hidden="true" /> : <FiLink aria-hidden="true" />}
                        {linkCopied ? 'Link copied' : 'Copy link'}
                    </button>
                </footer>

                {(newer || older) && (
                    <nav className="post-pager" aria-label="More posts">
                        {older && (
                            <Link to={`/blog/${older.slug}`} className="pager-link pager-older">
                                <span className="pager-label"><FiArrowLeft aria-hidden="true" /> Older</span>
                                <span className="pager-title">{older.title}</span>
                            </Link>
                        )}
                        {newer && (
                            <Link to={`/blog/${newer.slug}`} className="pager-link pager-newer">
                                <span className="pager-label">Newer <FiArrowRight aria-hidden="true" /></span>
                                <span className="pager-title">{newer.title}</span>
                            </Link>
                        )}
                    </nav>
                )}

                <Footer />
            </main>
        </>
    );
}

export default BlogPost;
