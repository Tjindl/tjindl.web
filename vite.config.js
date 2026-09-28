import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdownPosts from './plugins/markdown-posts.js';
import external from './src/blog/external.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownPosts({ external })],
  base: '/tjindl.web/', // Explicitly set the base path for GitHub Pages
  assetsInclude: ['**/*.pdf'], // Treat PDF files as static assets
});
