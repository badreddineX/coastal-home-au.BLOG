import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.datePublished).getTime() - new Date(a.data.datePublished).getTime()
  );

  return rss({
    title: 'Outdoor & Coastal Home Decor',
    description: 'Coastal living and outdoor entertaining ideas for Australian homes.',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.datePublished,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-au</language>`,
  });
}
