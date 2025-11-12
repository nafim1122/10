import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: ensure esbuild treats .js files as jsx so existing .js files
// that contain JSX parse correctly. Preferable long-term: rename files to
// .jsx/.tsx where applicable.
export default defineConfig({
  plugins: [react()],
  // esbuild.loader expects a string. Use 'jsx' so files with .js that contain
  // JSX will be parsed correctly during Vercel/Vite builds. Long term prefer
  // renaming files containing JSX to .jsx/.tsx.
  esbuild: {
    loader: 'jsx'
  },
  server: {
    host: '127.0.0.1'
  }
})
