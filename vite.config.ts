import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// html2canvas는 export 시점에 동적 import (PRD 6장)
export default defineConfig({
  plugins: [react()],
server: { port: 5173 },
});
