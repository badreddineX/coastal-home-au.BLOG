import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://outdoorcoastalhome.com',
  integrations: [sitemap()],
  redirects: {
    '/blog/07-outdoor-entertaining-ideas-australia': '/blog/outdoor-entertaining-ideas-australia',
    '/blog/16-hamptons-style-living-room-ideas-australia': '/blog/hamptons-style-living-room-australia',
  },
});
