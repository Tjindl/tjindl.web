import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navigation from './Navigation.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import './App.css';

// Blog pages are split out so KaTeX's stylesheet and post styles only load when needed.
const BlogIndex = lazy(() => import('./pages/BlogIndex.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

// New pages start at the top; links like /#projects scroll to that home section.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <MotionConfig reducedMotion="user">
        <div className="App">
          <ScrollManager />
          <Navigation />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ScrollToTop />
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
