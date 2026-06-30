import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coastal-home-au-blog.vercel.app',
  integrations: [sitemap()],
});
