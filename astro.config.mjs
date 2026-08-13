import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import rehypeOptimizeImages from './src/lib/rehype-optimize-images.mjs';
import rehypeNumberHeadings from './src/lib/rehype-number-headings.mjs';

// Read each post's dateModified straight from frontmatter (no astro:content
// access is available here in the config file) so the sitemap can carry a
// real lastmod per URL -- it had none before, which gives Google nothing to
// prioritize a recrawl against after a content/code change. Same fix already
// applied on Canada/UK.
const blogDir = fileURLToPath(new URL('./src/content/blog/', import.meta.url));
const postDates = {};
let mostRecentDate = '2026-01-01';
for (const file of readdirSync(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const content = readFileSync(blogDir + file, 'utf-8');
  const match = content.match(/^dateModified:\s*"([^"]+)"/m);
  if (match) {
    const slug = file.replace(/\.md$/, '');
    postDates[slug] = match[1];
    if (match[1] > mostRecentDate) mostRecentDate = match[1];
  }
}

export default defineConfig({
  site: 'https://outdoorcoastalhome.com',
  trailingSlash: 'never',
  // Inline all page stylesheets instead of shipping them as separate
  // render-blocking <link> requests -- same fix Canada/UK applied after PSI
  // flagged render-blocking CSS; AU's own PageSpeed check (2026-08-07) showed
  // mobile LCP at 4.2s, so this directly targets that.
  build: { inlineStylesheets: 'always' },
  // Rewrites inline blog-post images (![alt](path) in markdown) to their
  // WebP sibling + adds loading="lazy"/decoding="async" -- previously only
  // the hero image was optimized; the 3-6 inline images per post were
  // still full-size eager JPEGs, a bigger real contributor to page weight
  // than the single hero on image-heavy posts.
  markdown: {
    rehypePlugins: [rehypeOptimizeImages, rehypeNumberHeadings],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/404'),
      serialize(item) {
        const slug = item.url.replace('https://outdoorcoastalhome.com/blog/', '');
        if (postDates[slug]) {
          item.lastmod = postDates[slug];
        } else if (/\/blog(\/category\/[a-z-]+)?\/?$/.test(item.url) || item.url.replace(/\/$/, '') === 'https://outdoorcoastalhome.com') {
          // homepage, /blog index, and category pages all surface/aggregate
          // recent posts, so their real freshness tracks the newest post
          item.lastmod = mostRecentDate;
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/blog/07-outdoor-entertaining-ideas-australia': '/blog/outdoor-entertaining-ideas-australia',
    '/blog/16-hamptons-style-living-room-ideas-australia': '/blog/hamptons-style-living-room-australia',
  },
});
