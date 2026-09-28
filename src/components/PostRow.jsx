import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { formatDate } from '../blog/posts';
import './PostRow.css';

// A post row linking to the post page, or out to where it was published.
function PostRow({ post, showYear = true }) {
    const date = formatDate(post.date, showYear ? undefined : { month: 'short', day: 'numeric' });
    const body = (
        <>
            <span className="post-row-date">{date}</span>
            <span className="post-row-main">
                <span className="post-row-title">
                    {post.title}
                    {post.external && <FiArrowUpRight className="post-row-arrow" aria-hidden="true" />}
                </span>
                {post.summary && <span className="post-row-summary">{post.summary}</span>}
                <span className="post-row-meta">
                    {post.readingTime} min read
                    {post.external && <> · {post.source}</>}
                    {post.original && <> · also on {post.original.source}</>}
                    {post.draft && <span className="post-draft">draft</span>}
                </span>
            </span>
        </>
    );
    return post.external ? (
        <a className="post-row" href={post.url} target="_blank" rel="noopener noreferrer">{body}</a>
    ) : (
        <Link className="post-row" to={`/blog/${post.slug}`}>{body}</Link>
    );
}

export default PostRow;
