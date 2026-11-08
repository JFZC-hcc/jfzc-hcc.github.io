import { getCollection } from 'astro:content';
import { blogHref, projectHref } from './content-paths';

export type ChangelogType = 'article-new' | 'article-update' | 'project-new' | 'feature' | 'site';

export const CHANGELOG_TYPE_LABELS: Record<ChangelogType, string> = {
	'article-new': '新文章',
	'article-update': '文章更新',
	'project-new': '新项目',
	feature: '新功能',
	site: '网站调整',
};

export interface ChangelogItem {
	id: string;
	type: ChangelogType;
	title: string;
	description: string;
	date: Date;
	/** 由 `ref`（内容条目）或 `link`（外部/固定路径）解析得到；解析不到时为 undefined。 */
	href?: string;
}

/**
 * 读取全部非草稿公告，解析链接并按日期倒序排列。
 * 草稿由 `npm run changelog:check` 阻止发布，这里直接过滤掉。
 */
export async function getChangelogEntries(): Promise<ChangelogItem[]> {
	const [entries, posts, projects] = await Promise.all([
		getCollection('changelog'),
		getCollection('blog'),
		getCollection('projects'),
	]);

	const hrefs = new Map<string, string>();
	for (const post of posts) hrefs.set(`blog/${post.id}`, blogHref(post.id));
	for (const project of projects) hrefs.set(`projects/${project.id}`, projectHref(project.id));

	return entries
		.filter((entry) => !entry.data.draft)
		.map((entry) => ({
			id: entry.id,
			type: entry.data.type,
			title: entry.data.title,
			description: entry.data.description,
			date: entry.data.date,
			href: entry.data.link ?? (entry.data.ref ? hrefs.get(entry.data.ref) : undefined),
		}))
		.sort((a, b) => b.date.getTime() - a.date.getTime() || a.id.localeCompare(b.id));
}

/** 按年份分组（年份倒序，组内保持原有倒序）。 */
export function groupEntriesByYear(entries: readonly ChangelogItem[]): Array<[string, ChangelogItem[]]> {
	const groups = new Map<string, ChangelogItem[]>();
	for (const entry of entries) {
		const year = entry.date.toISOString().slice(0, 4);
		const list = groups.get(year) ?? [];
		list.push(entry);
		groups.set(year, list);
	}
	return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

/** 以 UTC 取日期，避免构建机器的时区把日期挪一天。 */
export function formatChangelogDate(date: Date): { iso: string; label: string } {
	const iso = date.toISOString().slice(0, 10);
	const [year, month, day] = iso.split('-');
	return { iso, label: `${year}.${month}.${day}` };
}
