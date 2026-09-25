import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 博客文章。新增文章 = 往 src/content/blog/ 丢一个 .md 文件，
 * 列表页、标签页与 RSS 会自动捕获，无需改任何代码。
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** draft: true 时只在 dev 可见，生产构建会被排除 */
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

/** 作品集条目。 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    /** 使用的技术栈，渲染为 Badge */
    tech: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    /** 是否在首页精选区展示 */
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { blog, projects };
