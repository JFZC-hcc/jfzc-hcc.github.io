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
	loadProjects,
	relativePath,
	serializeEntry,
	todayISO,
	writeEntry,
} from './changelog-lib.mjs';

/**
 * 计算并写入缺失的公告（幂等，不读 git 历史）。
 * - 新文章（pubDate 在 [startDate, 今天]）→ article-new
 * - 旧文修改（updatedDate 在 [startDate, 今天]）→ article-update 草稿
 *
 * 供 CLI 和 dev 监听器共用。
 * @param {{ dryRun?: boolean }} [options]
 */
export function syncChangelog({ dryRun = false } = {}) {
	const today = todayISO();
	const startDate = changelogConfig.startDate;
	const posts = loadPosts();
	const projects = loadProjects();
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
			if (updatedDate > pubDate && updatedDate >= startDate && updatedDate <= today) {
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

	// 项目修改：updatedDate 晚于项目日期时生成 project-update 草稿。
	for (const project of projects) {
		if (!project.data.updatedDate) continue;

		const updatedDate = dateOnly(project.data.updatedDate);
		const publishedDate = dateOnly(project.data.date);
		if (updatedDate <= publishedDate) continue;
		if (updatedDate < startDate || updatedDate > today) continue;

		const key = `project-update|projects/${project.id}|${updatedDate}`;
		if (existing.has(key)) continue;

		planned.push({
			id: project.id,
			type: 'project-update',
			source: 'automatic',
			title: project.data.title || project.id,
			description: UPDATE_PLACEHOLDER,
			date: updatedDate,
			ref: `projects/${project.id}`,
			draft: true,
		});
		existing.add(key);
	}

	const created = [];
	for (const entry of planned) {
		let file = join(DIRS.changelog, entryFilename(entry));
		let attempt = 1;
		while (existsSync(file)) {
			attempt += 1;
			file = join(DIRS.changelog, entryFilename({ ...entry, id: `${entry.id}-${attempt}` }));
		}

		if (!dryRun) writeEntry(file, serializeEntry(entry));
		created.push({ file, relative: relativePath(file), entry });
	}

	return {
		created,
		posts: posts.length,
		entries: entries.length,
		drafts: created.filter((item) => item.entry.draft).length,
	};
}
