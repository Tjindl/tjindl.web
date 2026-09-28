// Compiles blog posts in src/posts/*.md at build time.
//
//   import meta from './post.md?meta'  -> frontmatter + slug + reading time (no body)
//   import post from './post.md'       -> the above + rendered `html` and a `toc` of h2/h3 headings
//
// Maths ($…$, $$…$$) is rendered to HTML by KaTeX and code is highlighted by highlight.js here,
// so the browser only needs KaTeX's stylesheet. Drafts are served in dev but never built.
// After a build, each published post also gets its own index.html (so shared links unfurl with
// the post's title and summary) and the blog gets an RSS feed.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import katexPlugin from '@vscode/markdown-it-katex';
import hljs from 'highlight.js';

const POSTS_DIR = path.resolve('src/posts');
const WORDS_PER_MINUTE = 220;
const SITE_ORIGIN = 'https://tjindl.github.io';
const AUTHOR = 'Tushar Jindal';

const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

const toIsoDate = (value, file) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error(`${file}: frontmatter "date" must be YYYY-MM-DD`);
    return date.toISOString().slice(0, 10);
};

function readPost(file) {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const name = path.relative(process.cwd(), file);
    if (!data.title) throw new Error(`${name}: frontmatter needs a "title"`);
    if (!data.date) throw new Error(`${name}: frontmatter needs a "date"`);
    const words = content.split(/\s+/).filter(Boolean).length;
    return {
        meta: {
            slug: path.basename(file, '.md'),
            title: String(data.title),
            date: toIsoDate(data.date, name),
            summary: data.summary ? String(data.summary) : '',
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            draft: Boolean(data.draft),
            readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        },
        content,
    };
}

function createRenderer(base) {
    const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
    let toc = [];

    md.use(anchor, {
        level: [2, 3],
        permalink: anchor.permalink.linkInsideHeader({ symbol: '#', placement: 'before', ariaHidden: true }),
        callback: (token, { slug, title }) => toc.push({ id: slug, title, level: Number(token.tag.slice(1)) }),
    });
    md.use(footnote);
    md.use(katexPlugin.default ?? katexPlugin, { throwOnError: false });

    // Code blocks: highlighted, labelled with their language, with a copy button (wired up in BlogPost.jsx).
    md.renderer.rules.fence = (tokens, idx) => {
        const { content, info } = tokens[idx];
        const lang = info.trim().split(/\s+/)[0];
        const code = lang && hljs.getLanguage(lang)
            ? hljs.highlight(content, { language: lang, ignoreIllegals: true }).value
            : escapeHtml(content);
        return `<div class="code-block">${lang ? `<span class="code-lang">${escapeHtml(lang)}</span>` : ''}`
            + '<button type="button" class="code-copy">Copy</button>'
            + `<pre><code class="hljs">${code}</code></pre></div>\n`;
    };

    // Relative image paths resolve to public/posts/, e.g. ![Loss curve](my-post/loss.png).
    const renderImage = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const src = token.attrGet('src');
        if (src && !/^([a-z]+:|\/|#)/i.test(src)) token.attrSet('src', `${base}posts/${src}`);
        token.attrSet('loading', 'lazy');
        return renderImage(tokens, idx, options, env, self);
    };

    // External links open in a new tab.
    const renderLinkOpen = md.renderer.rules.link_open ?? ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const href = tokens[idx].attrGet('href') ?? '';
        if (/^https?:\/\//.test(href)) {
            tokens[idx].attrSet('target', '_blank');
            tokens[idx].attrSet('rel', 'noopener noreferrer');
        }
        return renderLinkOpen(tokens, idx, options, env, self);
    };

    return (content) => {
        toc = [];
        const html = md.render(content);
        return { html, toc };
    };
}

// Replaces the page's title/description tags and appends extra head tags.
function withMeta(html, { title, description, url, type = 'website', extra = '' }) {
    const setMeta = (source, attr, key, value) =>
        source.replace(new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`), `$1${escapeHtml(value)}$2`);
    let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    out = setMeta(out, 'name', 'description', description);
    out = setMeta(out, 'property', 'og:title', title);
    out = setMeta(out, 'property', 'og:description', description);
    const tags = [
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:type" content="${type}" />`,
        '<meta name="twitter:card" content="summary" />',
        extra,
    ].filter(Boolean).join('\n  ');
    return out.replace('</head>', `  ${tags}\n</head>`);
}

function buildFeed({ siteUrl, posts, external }) {
    const items = [
        ...posts.map((p) => ({ ...p, link: `${siteUrl}blog/${p.slug}/` })),
        ...external.map((p) => ({ ...p, link: p.url })),
    ].sort((a, b) => b.date.localeCompare(a.date));
    const entries = items.map((p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${escapeHtml(p.link)}</link>
      <guid isPermaLink="true">${escapeHtml(p.link)}</guid>
      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(p.summary ?? '')}</description>
    </item>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${AUTHOR} · Writing</title>
    <link>${siteUrl}blog/</link>
    <atom:link href="${siteUrl}blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Writing by ${AUTHOR}</description>
    <language>en</language>
${entries}
  </channel>
</rss>
`;
}

export default function markdownPosts({ external = [] } = {}) {
    let config;
    let render;
    let isBuild = false;

    return {
        name: 'markdown-posts',
        enforce: 'pre',

        configResolved(resolved) {
            config = resolved;
            isBuild = resolved.command === 'build';
            render = createRenderer(resolved.base);
        },

        load(id) {
            const [file, query] = id.split('?');
            if (!file.endsWith('.md') || !file.startsWith(POSTS_DIR)) return null;
            this.addWatchFile(file);
            const { meta, content } = readPost(file);
            // Drafts never reach a production bundle, not even their titles.
            if (isBuild && meta.draft) return 'export default null;';
            if (query === 'meta') return `export default ${JSON.stringify(meta)};`;
            return `export default ${JSON.stringify({ ...meta, ...render(content) })};`;
        },

        closeBundle() {
            if (!isBuild) return;
            const outDir = path.resolve(config.root, config.build.outDir);
            const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
            const siteUrl = new URL(config.base, SITE_ORIGIN).href;
            const posts = fs.readdirSync(POSTS_DIR)
                .filter((f) => f.endsWith('.md'))
                .map((f) => readPost(path.join(POSTS_DIR, f)).meta)
                .filter((p) => !p.draft);

            const write = (rel, contents) => {
                const target = path.join(outDir, rel);
                fs.mkdirSync(path.dirname(target), { recursive: true });
                fs.writeFileSync(target, contents);
            };

            write('blog/index.html', withMeta(template, {
                title: `Writing — ${AUTHOR}`,
                description: `Writing by ${AUTHOR} on machine learning, systems, and mathematics.`,
                url: `${siteUrl}blog/`,
                extra: `<link rel="alternate" type="application/rss+xml" title="${AUTHOR} · Writing" href="${siteUrl}blog/rss.xml" />`,
            }));
            for (const post of posts) {
                write(`blog/${post.slug}/index.html`, withMeta(template, {
                    title: `${post.title} — ${AUTHOR}`,
                    description: post.summary || post.title,
                    url: `${siteUrl}blog/${post.slug}/`,
                    type: 'article',
                    extra: `<meta property="article:published_time" content="${post.date}" />`,
                }));
            }
            write('blog/rss.xml', buildFeed({ siteUrl, posts, external }));
        },
    };
}
