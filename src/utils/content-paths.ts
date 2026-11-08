import { cleanContentSlug } from '../config/i18n';

/**
 * 内容条目的公开链接规则只在这里维护一份。
 * 之前 `/blog/${...}` 与 `/projects/${...}` 散落在多个组件里，
 * 改一次路径要动好几处；公告的 ref 解析也统一走这里。
 */

export function blogHref(id: string): string {
	return `/blog/${cleanContentSlug(id)}`;
}

export function projectHref(id: string): string {
	return `/projects/${cleanContentSlug(id)}`;
}
