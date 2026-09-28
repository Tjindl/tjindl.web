import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { hasWriting } from '../blog/posts';
import useDocumentTitle from '../useDocumentTitle';
import './Blog.css';

function NotFound() {
    useDocumentTitle('Not found');

    return (
        <main className="main not-found">
            <p className="byline">Error 404</p>
            <p className="not-found-mark" aria-hidden="true">∅</p>
            <h1 className="not-found-title">This page is an element of the empty set.</h1>
            <div className="not-found-actions">
                <Link className="btn btn-primary" to="/">Back home</Link>
                {hasWriting && <Link className="btn btn-ghost" to="/blog">Read the blog</Link>}
            </div>
            <Footer />
        </main>
    );
}

export default NotFound;
