import { defineCollection, z } from 'astro:content';

const writingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    description: z.string().optional(),
    pubDate: z.date().optional().default(() => new Date()),
    updatedDate: z.date().optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = {
  writing: writingCollection,
  pages: pagesCollection,
};
