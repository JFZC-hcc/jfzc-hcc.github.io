/**
 * 公告系统配置。
 *
 * - startDate：公告板上线日期。早于它的文章和修改不补档。
 * - noAnnounce：不生成公告的文章 id（相对 `src/content/blog` 的路径，不含 .md）。
 *   自动公告被手动删除后，下次同步会重新生成；如果永久不想公告某篇，
 *   把 id 写进这个数组。
 */
export const changelogConfig = {
	startDate: '2026-11-08',
	noAnnounce: [],
};
