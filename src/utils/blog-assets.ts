import { readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

// 文章配图按约定放在 public/blog/<文章名>/ 下(由 scripts/blog-folders.mjs 自动创建)
const blogImageDir = resolve('public', 'blog');
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

function getImageFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return getImageFiles(path);
		return entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
	});
}

function encodePath(path: string): string {
	return path
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
}

export function getBlogImageAssets() {
	const files = getImageFiles(blogImageDir);
	const counts = new Map<string, number>();

	files.forEach((file) => {
		const name = file.split(/[\\/]/).at(-1)?.toLowerCase();
		if (!name) return;
		counts.set(name, (counts.get(name) ?? 0) + 1);
	});

	return files.flatMap((file) => {
		const name = file.split(/[\\/]/).at(-1);
		if (!name || counts.get(name.toLowerCase()) !== 1) return [];

		const path = relative(blogImageDir, file).replace(/\\/g, '/');

		return [
			{
				name,
				url: `/blog-assets/${encodePath(path)}`,
			},
		];
	});
}
