import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string().default(''),
		description: z.string().trim().default('').transform((value) => value.replace(/\\n/g, '\n')),
		pubDate: z.date().default(new Date('1970-01-01')),
		updatedDate: z.date().optional(),
		tags: z.array(z.string()).default([]),
		cover: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		lang: z.literal('zh').default('zh'),
		title: z.string(),
		description: z.string().trim().transform((value) => value.replace(/\\n/g, '\n')),
		date: z.date(),
		tags: z.array(z.string()).default([]),
		role: z.string(),
		url: z.string().url().optional(),
		urlLabel: z.string().optional(),
		repo: z.string().url().optional(),
		updatedDate: z.date().optional(),
		featured: z.boolean().default(false),
	}),
});

/**
 * 网站更新公告。
 * 每条公告一个 YAML 文件，文件名即条目 id；`ref` 指向内容集合条目，
 * 由 `src/utils/changelog.ts` 在构建时解析成真实链接。
 */
const changelog = defineCollection({
	loader: glob({ pattern: '**/*.yml', base: './src/content/changelog' }),
	schema: z.object({
		type: z.enum(['article-new', 'article-update', 'project-new', 'project-update', 'feature', 'site']),
		source: z.enum(['automatic', 'manual']).default('manual'),
		title: z.string().min(1),
		description: z.string().trim().default('').transform((value) => value.replace(/\\n/g, '\n')),
		date: z.coerce.date(),
		ref: z.string().optional(),
		link: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, projects, changelog };
