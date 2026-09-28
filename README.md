# Tushar Jindal's Portfolio

A modern, responsive portfolio website built with React and Vite, showcasing my projects and skills as a BSc Mathematics student at UBC Vancouver.

## Features

- 🎨 Modern, minimalist design with a dark theme
- 📱 Fully responsive layout
- 🔄 Smooth scrolling navigation
- 🏷️ Project filtering by technology
- 🎯 Skills categorization
- 🔗 Easy connection links (LinkedIn, GitHub, Email)

## Technologies Used

- React 18.3
- Vite
- React Bootstrap
- React Scroll
- CSS3 with modern animations

## Writing blog posts

Posts are Markdown files in `src/posts/`. The file name is the URL: `src/posts/my-post.md` is
published at `/blog/my-post`.

```markdown
---
title: Perplexity is a misleading proxy for quality
date: 2026-10-01
summary: One or two sentences, shown in the post list, link previews and RSS.
tags: [llms, statistics]
draft: true
---

Your post, in Markdown. Maths works inline ($e^{i\pi} + 1 = 0$) and in display blocks ($$…$$).
```

- **Drafts** (`draft: true`) appear in `npm run dev` but are left out of production builds. Remove
  the line to publish.
- **Maths** is rendered with KaTeX and **code blocks** are syntax highlighted, both at build time.
- **Images** go in `public/posts/<slug>/` and are referenced relative to `public/posts/`, e.g.
  `![Loss curve](my-post/loss.png)`.
- `src/posts/formatting-guide.md` is a draft that demonstrates every feature; copy it to start.
- Articles published elsewhere (e.g. Medium) are listed in `src/blog/external.js`.

Each published post gets its own HTML page with the post's title and summary (so shared links
preview correctly), and the build writes an RSS feed to `/blog/rss.xml`.

## Running Locally

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/assets` - Images and other static assets
  - `/styles` - CSS files

## Contributing

Feel free to fork this project and customize it for your own use. If you find any bugs or have suggestions for improvements, please open an issue.
