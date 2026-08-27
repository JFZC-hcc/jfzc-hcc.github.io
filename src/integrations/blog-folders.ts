import type { AstroIntegration } from 'astro';
import { syncBlogFolders, watchBlogFolders } from '../../scripts/blog-folders.mjs';

let stopWatcher: (() => void) | undefined;

/**
 * 博客资源文件夹自动化集成：
 * - 启动开发服务器时监听 src/content/blog/，新增 .md 自动在 public/blog/ 下创建同名文件夹
 * - 构建/预览前同步一次，确保资源文件夹已就绪
 */
export default function blogFolders(): AstroIntegration {
    return {
        name: 'blog-folders',
        hooks: {
            'astro:config:setup': ({ logger }) => {
                try {
                    const created = syncBlogFolders();
                    if (created.length > 0) {
                        logger.info(`已为 ${created.length} 篇文章创建资源文件夹`);
                    }
                } catch (error) {
                    logger.warn(`创建博客资源文件夹失败：${error instanceof Error ? error.message : String(error)}`);
                }
            },
            'astro:server:setup': ({ logger }) => {
                try {
                    stopWatcher?.();
                    stopWatcher = watchBlogFolders((created) => {
                        if (created.length > 0) {
                            logger.info(`已为 ${created.length} 篇文章创建资源文件夹`);
                        }
                    });
                } catch (error) {
                    logger.warn(`启动博客资源文件夹监听失败：${error instanceof Error ? error.message : String(error)}`);
                }
            },
            'astro:server:done': () => {
                stopWatcher?.();
                stopWatcher = undefined;
            },
        },
    };
}
