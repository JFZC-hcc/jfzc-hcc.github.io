// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeKatex from 'rehype-katex';
import remarkDisplayMath from './src/config/remarkDisplayMath.mjs';
import remarkMath from 'remark-math';
import remarkWikiLinks from './src/config/remarkWikiLinks.mjs';

const dynamicMode = process.env.ATLAS_DYNAMIC === 'true';
const adapter = dynamicMode ? (await import('@astrojs/node')).default({ mode: 'standalone' }) : undefined;

// https://astro.build/config
export default defineConfig({
	site: 'https://jfzc-hcc.github.io',
	output: dynamicMode ? 'server' : 'static',
	adapter,
	markdown: {
		remarkPlugins: [remarkMath, remarkDisplayMath, remarkWikiLinks],
		rehypePlugins: [rehypeKatex],
	},
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh'],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
