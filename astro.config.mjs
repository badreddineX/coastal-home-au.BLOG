import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coastalhomeau.com.au',
  integrations: [sitemap()],
});
