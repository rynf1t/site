import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional().default(''),
    pubDate: z.date().default(() => new Date()),
    updatedDate: z.date().optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),  // Default to high number for unordered pages
  }),
});

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
};