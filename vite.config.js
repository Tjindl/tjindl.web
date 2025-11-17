import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
  const base = repoName === `${process.env.GITHUB_ACTOR}.github.io` ? '/' : `/${repoName}/`;

  return {
    plugins: [react()],
    base,
  };
});
