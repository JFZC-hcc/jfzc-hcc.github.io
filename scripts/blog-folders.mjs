/**
 * 博客资源文件夹管理脚本
 *
 * 约定：每篇博客文章 `src/content/blog/<文章名>.md`
 *       对应一个图片资源文件夹 `public/blog/<文章名>/`
 *
 * 用法：
 *   node scripts/blog-folders.mjs            # 同步一次：为缺少文件夹的文章创建文件夹
 *   node scripts/blog-folders.mjs --watch    # 监听模式：新增 .md 时自动创建同名文件夹
 *
 * 该脚本只创建、不删除、不移动任何已有文件，幂等安全。
 */
import { existsSync, mkdirSync, readdirSync, watch } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const PUBLIC_BLOG_DIR = join(ROOT, 'public', 'blog');

const log = (...args) => console.log('[blog-folders]', ...args);
const warn = (...args) => console.warn('[blog-folders]', ...args);

/** 判断是否为博客文章 Markdown 文件（排除 . 开头的临时/隐藏文件） */
function isMarkdownFile(name) {
    const base = name.split(/[\\/]/).at(-1) ?? '';
    return base.toLowerCase().endsWith('.md') && !base.startsWith('.');
}

/** 递归列出博客目录下所有 .md 文件 */
function listMarkdownFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return listMarkdownFiles(path);
        return entry.isFile() && isMarkdownFile(entry.name) ? [path] : [];
    });
}

/**
 * 为每篇博客文章在 public/blog/ 下创建同名文件夹（幂等）。
 * 只创建缺失的文件夹，返回本次新建的文件夹绝对路径列表。
 */
export function syncBlogFolders() {
    if (!existsSync(BLOG_DIR)) return [];

    const created = [];
    const seen = new Map();

    for (const file of listMarkdownFiles(BLOG_DIR)) {
        const name = file.split(/[\\/]/).at(-1).replace(/\.md$/i, '');
        if (!name) continue;

        if (seen.has(name)) {
            warn(`检测到同名文章「${name}」，跳过：${relative(BLOG_DIR, seen.get(name))} 与 ${relative(BLOG_DIR, file)}`);
            continue;
        }
        seen.set(name, file);

        const dir = join(PUBLIC_BLOG_DIR, name);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            created.push(dir);
        }
    }

    return created;
}

/**
 * 监听 src/content/blog/，新增 .md 文件时自动创建同名资源文件夹。
 * 返回停止监听的函数。
 */
export function watchBlogFolders(onSync = () => { }) {
    let stopped = false;
    let timer = null;

    const sync = () => {
        if (stopped) return;
        const created = syncBlogFolders();
        if (created.length > 0) {
            log(`已为 ${created.length} 篇文章创建资源文件夹：`);
            created.forEach((dir) => log(`  ${relative(ROOT, dir)}`));
        }
        onSync(created);
    };

    const trigger = () => {
        clearTimeout(timer);
        timer = setTimeout(sync, 300);
    };

    // Linux 下 recursive 监听需要 Node >= 19.1，项目要求 Node >= 22，满足
    const watcher = watch(BLOG_DIR, { recursive: true }, (_event, filename) => {
        if (filename === null || isMarkdownFile(filename)) trigger();
    });

    watcher.on('error', (error) => warn(`监听出错：${error.message}`));

    // 启动时先同步一次
    sync();

    return () => {
        stopped = true;
        clearTimeout(timer);
        watcher.close();
    };
}

// 直接运行时作为 CLI
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
    if (process.argv.includes('--watch')) {
        log(`监听中：${relative(ROOT, BLOG_DIR)} 下新增 .md 文件时，将自动在 ${relative(ROOT, PUBLIC_BLOG_DIR)} 下创建同名文件夹`);
        watchBlogFolders();
    } else {
        const created = syncBlogFolders();
        if (created.length > 0) {
            log(`已创建 ${created.length} 个文件夹：`);
            created.forEach((dir) => log(`  ${relative(ROOT, dir)}`));
        } else {
            log('所有博客文章均已有对应资源文件夹，无需创建');
        }
    }
}
