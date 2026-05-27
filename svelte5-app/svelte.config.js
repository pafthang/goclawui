import type { Config } from '@sveltejs/kit';
import adapter from '@sveltejs/adapter-auto';

const config: Config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@': './src'
		}
	}
};

export default config;
