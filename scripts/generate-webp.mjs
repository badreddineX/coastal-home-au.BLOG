// Generates a WebP sibling for every JPEG/PNG referenced by a blog post's
// `image` frontmatter field, plus the site's fixed fallback image. Originals
// are kept as-is (fallback for browsers/crawlers that skip <picture>); the
// audit's "1,985 KiB of image savings" finding is a direct WebP win since
// these photos aren't run through Astro's asset pipeline (public/ files
// referenced by content-collection string paths bypass it entirely).
import sharp from 'sharp';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const BLOG_DIR = resolve('src/content/blog');
const IMAGES_DIR = resolve('public/images');

const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
const images = new Set(['unsplash-1600566753086-00f18fb6b3ea.jpg']); // SEO.astro fallback

for (const f of files) {
  const raw = readFileSync(resolve(BLOG_DIR, f), 'utf8');
  const m = raw.match(/^image:\s*"?\/images\/([^"\n]+)"?/m);
  if (m) images.add(m[1]);
}

console.log(`Converting ${images.size} images to WebP...`);
let done = 0, skipped = 0;

for (const img of images) {
  const src = resolve(IMAGES_DIR, img);
  const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!existsSync(src)) { console.log(`  ! missing: ${img}`); continue; }
  if (existsSync(dest)) { skipped++; continue; }
  await sharp(src).webp({ quality: 80 }).toFile(dest);
  done++;
}

console.log(`✓ ${done} converted, ${skipped} already existed, ${images.size} total`);
