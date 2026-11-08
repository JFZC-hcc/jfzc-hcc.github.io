import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { changelogConfig } from './changelog.config.mjs';
import {
	DIRS,
	UPDATE_PLACEHOLDER,
	dateOnly,
	entryFilename,
	loadEntries,
	loadPosts,
	relativePath,
	serializeEntry,
	todayISO,
	writeEntry,
} from './changelog-lib.mjs';

/**
 * 生成缺失的公告：
 * - 新文章（pubDate 在 [startDate, 今天]）→ article-new
 * - 旧文修改（updatedDate 在 [startDate, 今天]）→ article-update 草稿，等人补说明
 *
 * 幂等：已存在的 ref + 日期 + 类型组合会跳过；不读 git 历史。
 */
function main() {
	const dryRun = process.argv.includes('--dry-run');
	const today = todayISO();
	const startDate = changelogConfig.startDate;
	const posts = loadPosts();
	const entries = loadEntries();
	const noAnnounce = new Set(changelogConfig.noAnnounce ?? []);

	const existing = new Set(
		entries.map((entry) => `${entry.data.type}|${entry.data.ref ?? ''}|${dateOnly(entry.data.date)}`),
	);

	const planned = [];
	for (const post of posts) {
		if (post.data.draft || noAnnounce.has(post.id)) continue;

		const title = post.data.title || post.id;
		const description = post.data.description ?? '';

		const pubDate = dateOnly(post.data.pubDate);
		if (pubDate >= startDate && pubDate <= today) {
			const key = `article-new|blog/${post.id}|${pubDate}`;
			if (!existing.has(key)) {
				planned.push({
					id: post.id,
					type: 'article-new',
					source: 'automatic',
					title,
					description,
					date: pubDate,
					ref: `blog/${post.id}`,
				});
				existing.add(key);
			}
		}

		if (post.data.updatedDate) {
			const updatedDate = dateOnly(post.data.updatedDate);
			if (updatedDate >= startDate && updatedDate <= today) {
				const key = `article-update|blog/${post.id}|${updatedDate}`;
				if (!existing.has(key)) {
					planned.push({
						id: post.id,
						type: 'article-update',
						source: 'automatic',
						title,
						description: UPDATE_PLACEHOLDER,
						date: updatedDate,
						ref: `blog/${post.id}`,
						draft: true,
					});
					existing.add(key);
				}
			}
		}
	}

	let created = 0;
	for (const entry of planned) {
		let file = join(DIRS.changelog, entryFilename(entry));
		let attempt = 1;
		while (existsSync(file)) {
			attempt += 1;
			file = join(DIRS.changelog, entryFilename({ ...entry, id: `${entry.id}-${attempt}` }));
		}

		if (dryRun) {
			console.log(`[dry-run] 将创建 ${relativePath(file)}`);
		} else {
			writeEntry(file, serializeEntry(entry));
			console.log(`新建 ${relativePath(file)}`);
		}
		created += 1;
	}

	console.log('');
	console.log(`changelog:sync${dryRun ? '（dry-run）' : ''}`);
	console.log(`  文章 ${posts.length} 篇，已有公告 ${entries.length} 条`);
	if (created === 0) {
		console.log('  没有需要生成的公告');
	} else {
		console.log(`  生成 ${created} 条公告`);
	}

	if (planned.some((entry) => entry.draft)) {
		console.log('');
		console.log('  有文章更新公告还是草稿：请补充 description、移除 draft: true，然后运行 npm run changelog:check');
	}
}

try {
	main();
} catch (error) {
	console.error(`changelog:sync 失败：${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
}
