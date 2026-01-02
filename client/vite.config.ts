import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Use automatic JSX runtime (no need to import React)
            jsxRuntime: 'automatic',
        }),
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
        },
    },
});
// Force restart Thu Jan  1 04:00:41 +04 2026
