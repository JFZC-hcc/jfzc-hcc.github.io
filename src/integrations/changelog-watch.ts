import { watch, type FSWatcher } from 'node:fs';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';
import { syncChangelog } from '../../scripts/changelog-sync-core.mjs';

const watchers: FSWatcher[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;

/** 连续保存时合并成一次同步，避免每个写盘事件都跑一遍。 */
const DEBOUNCE_MS = 500;

/**
 * 开发服务器运行期间监听文章与项目目录：
 * 保存后自动生成缺失的公告（新文章）或文章/项目更新草稿（`updatedDate`）。
 * 构建阶段不注册任何钩子，所以不会改源码。
 */
export default function changelogWatch(): AstroIntegration {
	return {
		name: 'changelog-watch',
		hooks: {
			'astro:server:setup': ({ logger }) => {
				const run = (reason: string) => {
					try {
						const result = syncChangelog();
						if (result.created.length > 0) {
							const files = result.created.map((item) => item.relative).join('、');
							logger.info(`[changelog] ${reason}，已生成 ${result.created.length} 条公告：${files}`);
						}
						if (result.drafts > 0) {
							logger.warn('[changelog] 有文章/项目更新公告草稿待确认：补充 description、移除 draft: true');
						}
					} catch (error) {
						logger.error(
							`[changelog] 自动同步失败：${error instanceof Error ? error.message : String(error)}`,
						);
					}
				};

				run('启动时同步');

				const schedule = (filename: string | Buffer | null) => {
					const name =
						typeof filename === 'string' ? filename : (filename?.toString() ?? '');
					if (name && !name.endsWith('.md')) return;
					if (timer) clearTimeout(timer);
					timer = setTimeout(() => run('检测到内容变化'), DEBOUNCE_MS);
				};

				const listen = (dir: string) => {
					const onEvent = (_event: string, filename: string | null) =>
						schedule(filename);
					try {
						watchers.push(watch(dir, { recursive: true }, onEvent));
						return;
					} catch {
						// 少数文件系统不支持 recursive watch，退回到非递归（两个目录目前都是扁平的）。
					}
					try {
						watchers.push(watch(dir, onEvent));
					} catch (error) {
						logger.warn(
							`[changelog] 无法监听 ${dir}：${error instanceof Error ? error.message : String(error)}`,
						);
					}
				};

				for (const dir of ['blog', 'projects']) {
					listen(join(process.cwd(), 'src/content', dir));
				}
			},
			'astro:server:done': () => {
				if (timer) clearTimeout(timer);
				timer = undefined;
				for (const watcher of watchers) watcher.close();
				watchers.length = 0;
			},
		},
	};
}
