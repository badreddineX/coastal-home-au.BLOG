import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    author: z.string().default('Badreddine Br'),
    tags: z.array(z.string()),
    category: z.string(),
    readTime: z.string(),
    featured: z.boolean().optional().default(false),
    tldr: z.array(z.string()).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { blog };
