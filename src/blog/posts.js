import external from './external';

// Metadata for every post (small, bundled eagerly); bodies are separate chunks loaded on demand.
// Drafts are compiled to `null` in production builds by plugins/markdown-posts.js.
const metas = import.meta.glob('../posts/*.md', { query: '?meta', import: 'default', eager: true });
const bodies = import.meta.glob('../posts/*.md', { import: 'default' });

const localPosts = Object.entries(metas)
    .filter(([, meta]) => meta)
    .map(([file, meta]) => ({ ...meta, load: bodies[file] }));

const byDateDesc = (a, b) => b.date.localeCompare(a.date);

// Local posts link to /blog/<slug>; external ones carry a `url` and open in a new tab.
export const posts = [...localPosts, ...external.map((post) => ({ ...post, external: true }))].sort(byDateDesc);

// Newer-to-older order of local posts, for previous/next links.
export const readablePosts = localPosts.sort(byDateDesc);

export const getPost = (slug) => localPosts.find((post) => post.slug === slug);

export const hasWriting = posts.length > 0;

export const formatDate = (iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', options);
