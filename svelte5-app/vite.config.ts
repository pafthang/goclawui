import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		port: 5174,
		proxy: {
			'/ws': {
				target: 'http://localhost:9600',
				ws: true,
				changeOrigin: true
			},
			'/v1': {
				target: 'http://localhost:9600',
				changeOrigin: true,
				timeout: 30000
			},
			'/health': {
				target: 'http://localhost:9600',
				changeOrigin: true
			}
		}
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true
	}
});
