import { changelogConfig } from './changelog.config.mjs';
import {
	UPDATE_PLACEHOLDER,
	dateOnly,
	loadEntries,
	loadPosts,
	loadProjects,
	relativePath,
	todayISO,
} from './changelog-lib.mjs';

/**
 * 公告阻塞检查（CI 与本地都跑）：
 * 草稿未确认、文章变更缺公告、新文章缺公告、重复/孤儿引用等问题都会让退出码为 1。
 */
function main() {
	const today = todayISO();
	const startDate = changelogConfig.startDate;
	const posts = loadPosts();
	const projects = loadProjects();
	const entries = loadEntries();

	const errors = [];
	const warnings = [];

	const blogIds = new Set(posts.map((post) => post.id));
	const projectIds = new Set(projects.map((project) => project.id));

	const summaries = entries.map((entry) => ({
		file: entry.filePath,
		data: entry.data,
		date: dateOnly(entry.data.date),
	}));

	const hasEntry = (type, ref, date) =>
		summaries.some((entry) => entry.data.type === type && entry.data.ref === ref && entry.date === date);

	for (const entry of summaries) {
		if (entry.data.draft) {
			errors.push(`公告仍是草稿，请补充内容并移除 draft: ${entry.file}`);
		}

		if (entry.date > today) {
			warnings.push(`公告日期在未来: ${entry.file}`);
		}

		if (entry.data.link && !entry.data.link.startsWith('/') && !/^https?:\/\//.test(entry.data.link)) {
			warnings.push(`link 建议以 / 或 http(s):// 开头: ${entry.file}`);
		}

		if ((entry.data.type === 'article-update' || entry.data.type === 'project-update') && !entry.data.draft) {
			const description = (entry.data.description ?? '').trim();
			if (description === '' || description === UPDATE_PLACEHOLDER) {
				const kind = entry.data.type === 'project-update' ? '项目' : '文章';
				errors.push(`${kind}更新公告缺少说明: ${entry.file}`);
			}
		}

		if (entry.data.type === 'article-new' && !(entry.data.description ?? '').trim()) {
			warnings.push(`新文章公告没有描述: ${entry.file}`);
		}

		if (entry.data.ref) {
			const [collection, ...rest] = entry.data.ref.split('/');
			const id = rest.join('/');
			if (collection === 'blog' && !blogIds.has(id)) {
				errors.push(`公告引用了不存在的文章: ${entry.data.ref}（${entry.file}）`);
			} else if (collection === 'projects' && !projectIds.has(id)) {
				errors.push(`公告引用了不存在的项目: ${entry.data.ref}（${entry.file}）`);
			} else if (collection !== 'blog' && collection !== 'projects') {
				errors.push(`无法识别的 ref 前缀: ${entry.data.ref}（${entry.file}）`);
			}
		}
	}

	const seen = new Map();
	for (const entry of summaries) {
		// 人工公告可以没有 ref（同一天多条也不会冲突），只对指向内容条目的公告去重。
		if (!entry.data.ref) continue;
		const key = `${entry.data.type}|${entry.data.ref}|${entry.date}`;
		if (seen.has(key)) {
			errors.push(`重复公告: ${seen.get(key)} 与 ${entry.file}`);
		} else {
			seen.set(key, entry.file);
		}
	}

	const noAnnounce = new Set(changelogConfig.noAnnounce ?? []);
	for (const post of posts) {
		if (post.data.draft || noAnnounce.has(post.id)) continue;

		const title = post.data.title || post.id;
		const pubDate = dateOnly(post.data.pubDate);
		if (pubDate >= startDate && pubDate <= today && !hasEntry('article-new', `blog/${post.id}`, pubDate)) {
			errors.push(`文章《${title}》已发布，但缺少新文章公告（运行 npm run changelog:sync）`);
		}

		if (post.data.updatedDate) {
			const updatedDate = dateOnly(post.data.updatedDate);
			if (updatedDate > today) {
				warnings.push(`文章《${title}》的 updatedDate 在未来: ${updatedDate}`);
			} else if (updatedDate < pubDate) {
				warnings.push(`文章《${title}》的 updatedDate 早于 pubDate: ${updatedDate}`);
			} else if (
				updatedDate > pubDate &&
				updatedDate >= startDate &&
				!hasEntry('article-update', `blog/${post.id}`, updatedDate)
			) {
				errors.push(`文章《${title}》更新于 ${updatedDate}，但缺少文章更新公告（运行 npm run changelog:sync）`);
			}
		}
	}

	for (const project of projects) {
		if (!project.data.updatedDate) continue;

		const title = project.data.title || project.id;
		const updatedDate = dateOnly(project.data.updatedDate);
		const publishedDate = dateOnly(project.data.date);
		if (updatedDate > today) {
			warnings.push(`项目《${title}》的 updatedDate 在未来: ${updatedDate}`);
		} else if (updatedDate < publishedDate) {
			warnings.push(`项目《${title}》的 updatedDate 早于 date: ${updatedDate}`);
		} else if (
			updatedDate > publishedDate &&
			updatedDate >= startDate &&
			!hasEntry('project-update', `projects/${project.id}`, updatedDate)
		) {
			errors.push(`项目《${title}》更新于 ${updatedDate}，但缺少项目更新公告（运行 npm run changelog:sync）`);
		}
	}

	console.log(
		`changelog:check：${posts.length} 篇文章、${projects.length} 个项目、${entries.length} 条公告`,
	);
	for (const warning of warnings) console.warn(`  ⚠ ${warning}`);

	if (errors.length === 0) {
		console.log('  ✓ 公告检查通过');
		return;
	}

	console.error('');
	console.error(`  ✗ ${errors.length} 个问题：`);
	for (const error of errors) console.error(`    - ${error}`);
	console.error('');
	console.error('请确认公告！');
	process.exitCode = 1;
}

try {
	main();
} catch (error) {
	console.error(`changelog:check 失败：${error instanceof Error ? error.message : String(error)}`);
	console.error('请确认公告！');
	process.exitCode = 1;
}
