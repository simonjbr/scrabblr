import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		proxy: {
			'/api/cloudVision': {
				target: 'http://localhost:3001',
			},
			'/api/bestMoves': {
				target: 'http://localhost:3001',
			},
		},
	},
});
