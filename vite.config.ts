import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // Ensure correct asset paths when served from /<repo>/ on GitHub Pages
  base: '/vietnamese-staff-email-creator/',
  plugins: [react()],
})
