import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { slug } from 'github-slugger';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const DIRS = {
	root: ROOT,
	blog: join(ROOT, 'src/content/blog'),
	projects: join(ROOT, 'src/content/projects'),
	changelog: join(ROOT, 'src/content/changelog'),
};

/** 公告草稿的占位说明；check 会把它当成“还没写”处理。 */
export const UPDATE_PLACEHOLDER = '（请补充这次修改了什么）';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function walk(dir, extension, files = []) {
	if (!existsSync(dir)) return files;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) walk(full, extension, files);
		else if (entry.isFile() && entry.name.endsWith(extension)) files.push(full);
	}
	return files;
}

/**
 * 与 Astro content layer 的 id 规则保持一致（逐段 github-slugger），
 * 否则 `ref` 和 Astro 的条目 id 对不上，链接会解析失败。
 */
function toId(dir, file) {
	const relativePath = relative(dir, file).split(sep).join('/').replace(/\.md$/, '');
	return relativePath
		.split('/')
		.map((segment) => slug(segment))
		.join('/')
		.replace(/\/index$/, '');
}

export function relativePath(file) {
	return relative(ROOT, file).split(sep).join('/');
}

/** 读取 Markdown 文件里的 YAML frontmatter（对象）。 */
export function readFrontmatter(file) {
	const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
	const match = text.match(FRONTMATTER_RE);
	if (!match) throw new Error(`缺少 frontmatter：${relativePath(file)}`);
	const data = yaml.load(match[1]) ?? {};
	if (typeof data !== 'object' || Array.isArray(data)) {
		throw new Error(`frontmatter 不是对象：${relativePath(file)}`);
	}
	return data;
}

/** 读取全部博客文章（含草稿，由调用方过滤）。 */
export function loadPosts() {
	return walk(DIRS.blog, '.md').map((file) => ({
		id: toId(DIRS.blog, file),
		file,
		data: readFrontmatter(file),
	}));
}

export function loadProjects() {
	return walk(DIRS.projects, '.md').map((file) => ({
		id: toId(DIRS.projects, file),
		file,
		data: readFrontmatter(file),
	}));
}

/** 读取全部公告 YAML。 */
export function loadEntries() {
	return walk(DIRS.changelog, '.yml').map((file) => {
		const data = yaml.load(readFileSync(file, 'utf8')) ?? {};
		if (typeof data !== 'object' || Array.isArray(data)) {
			throw new Error(`公告不是对象：${relativePath(file)}`);
		}
		return { file, filePath: relativePath(file), data };
	});
}

/** YAML 日期（Date）或字符串统一成 YYYY-MM-DD。 */
export function dateOnly(value) {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) throw new Error('遇到无效日期');
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === 'string') {
		const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
		if (match) return match[1];
	}
	throw new Error(`无法识别的日期：${String(value)}`);
}

/** 以 Asia/Shanghai 的“今天”为准，避免构建机时区造成边界偏差。 */
export function todayISO(now = new Date()) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(now);
	const get = (type) => parts.find((part) => part.type === type)?.value ?? '';
	return `${get('year')}-${get('month')}-${get('day')}`;
}

export function slugForFilename(id) {
	const slug = id
		.replace(/[\\/:*?"<>|]/g, '-')
		.replace(/\s+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');
	return slug || 'entry';
}

export function entryFilename({ date, type, id }) {
	return `${date}-${type}-${slugForFilename(id)}.yml`;
}

/** 把公告对象序列化成 YAML 文本（日期保持 YYYY-MM-DD，不写成时间戳）。 */
export function serializeEntry(entry) {
	const ordered = {
		type: entry.type,
		source: entry.source,
		title: entry.title,
		description: entry.description,
		date: entry.date,
		...(entry.ref ? { ref: entry.ref } : {}),
		...(entry.link ? { link: entry.link } : {}),
		...(entry.draft ? { draft: true } : {}),
	};
	const body = yaml.dump(ordered, { lineWidth: -1, noRefs: true, sortKeys: false });
	return `# 由 npm run changelog:sync 自动生成，可以直接编辑本文件后提交。\n${body}`;
}

export function writeEntry(file, content) {
	mkdirSync(dirname(file), { recursive: true });
	// 先写临时文件再改名，避免 dev 监听器读到写了一半的 YAML。
	const temp = `${file}.${process.pid}.tmp`;
	try {
		writeFileSync(temp, content, 'utf8');
		renameSync(temp, file);
	} catch (error) {
		try {
			unlinkSync(temp);
		} catch {
			// 临时文件可能尚未创建，忽略。
		}
		throw error;
	}
}
