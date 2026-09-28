import { motion } from 'framer-motion';
import { FiRss } from 'react-icons/fi';
import Footer from '../components/Footer.jsx';
import PostRow from '../components/PostRow.jsx';
import { posts } from '../blog/posts';
import useDocumentTitle from '../useDocumentTitle';
import './Blog.css';

const RSS_URL = `${import.meta.env.BASE_URL}blog/rss.xml`;

// [[year, posts], …], newest year first.
const postsByYear = Object.entries(
    posts.reduce((groups, post) => {
        (groups[post.date.slice(0, 4)] ??= []).push(post);
        return groups;
    }, {})
).sort(([a], [b]) => b.localeCompare(a));

function BlogIndex() {
    useDocumentTitle('Writing');

    return (
        <main className="main blog">
            <motion.header
                className="blog-header"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <p className="byline">Tushar Jindal</p>
                <h1 className="blog-title">Writing</h1>
                <div className="blog-intro">
                    <p>Notes on machine learning, systems, and mathematics.</p>
                    <a className="rss-link" href={RSS_URL}>
                        <FiRss aria-hidden="true" /> RSS
                    </a>
                </div>
            </motion.header>

            {postsByYear.length === 0 && <p className="blog-empty">Nothing here yet.</p>}

            {postsByYear.map(([year, yearPosts]) => (
                <section className="blog-year" key={year} aria-label={year}>
                    <h2 className="blog-year-label">
                        {year}
                        <span className="section-rule" aria-hidden="true" />
                    </h2>
                    <div className="post-list">
                        {yearPosts.map((post) => (
                            <PostRow key={post.slug ?? post.url} post={post} showYear={false} />
                        ))}
                    </div>
                </section>
            ))}

            <Footer />
        </main>
    );
}

export default BlogIndex;
