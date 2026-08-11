// Generates Instagram Highlight covers (circular icons) and Pinterest board
// covers (square, branded) for Outdoor & Coastal Home — same design system
// as the pins: Playfair Display + Inter, shell/ocean/navy/sand palette.
// Writes to out-profile/highlights/ and out-profile/boards/.
// Usage: node generate-profile-covers.mjs

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@500;600;700&family=Pinyon+Script&display=swap" rel="stylesheet">`;

const BASE_CSS = `
  :root{ --shell:#FDFCFB; --ocean:#2E6F94; --navy:#1B3A4B; --sand:#D4B896; }
  *{margin:0;padding:0;box-sizing:border-box}
  body{overflow:hidden}
`;

// ── Instagram Highlight covers — 1080x1080, cropped to a circle by IG.
// Real photo from the matching category's blog post (not an abstract icon).
// Matches the site's 4 real repeated categories (see content taxonomy):
// Outdoor Entertaining, Coastal Decor, Hamptons Style, Backyard Ideas.
// (Home Office appears once and isn't a real recurring category — skipped,
// same rule Canada used.)
const HIGHLIGHT_PHOTOS = {
  entertaining: './public/images/unsplash-1530062845289-9109b2c9c868.jpg', // pergola-entertaining-ideas-australia
  coastal: './public/images/unsplash-1583847268964-b28dc8f51f92.jpg',      // coastal-living-room-ideas-australia (swapped from beach-house post: original photo read as a Maldives resort bungalow, not Australian home decor)
  hamptons: './public/images/unsplash-1560448204-603b3fc33ddc.jpg',        // hamptons-style-decor-australia
  backyard: './public/images/unsplash-1512917774080-9991f1c4c750.jpg',     // small-backyard-entertaining-ideas-australia
};

const highlightCover = (photoPath) => `
  <style>${BASE_CSS}
    body{width:1080px;height:1080px;display:flex;align-items:center;justify-content:center;
      background:var(--navy);}
    .ring{width:960px;height:960px;border-radius:50%;padding:14px;
      background:linear-gradient(135deg, var(--sand), var(--ocean));
      display:flex;align-items:center;justify-content:center;}
    .photo{width:100%;height:100%;border-radius:50%;
      background:url('${pathToFileURL(resolve(photoPath)).href}') center/cover no-repeat;
      box-shadow:inset 0 -140px 160px -80px rgba(15,26,33,.55);}
  </style>
  <div class="ring"><div class="photo"></div></div>
`;

// ── Pinterest board covers — 1000x1000 square (Pinterest center-crops to
// its own aspect on the profile grid, so keep key content centered).
const boardCover = (name) => `
  <style>${BASE_CSS}
    body{width:1000px;height:1000px;background:var(--shell);padding:56px;
      font-family:'Playfair Display',serif;}
    .frame{height:100%;border:4px solid var(--ocean);outline:1px solid var(--ocean);
      outline-offset:12px;display:flex;flex-direction:column;align-items:center;
      justify-content:center;text-align:center;padding:60px;gap:28px}
    .kicker{font-family:'Inter',sans-serif;font-weight:700;font-size:22px;
      letter-spacing:.3em;text-transform:uppercase;color:var(--sand)}
    .kicker::before,.kicker::after{content:'';width:34px;height:1px;background:var(--sand)}
    .kicker{display:flex;align-items:center;gap:18px}
    h2{font-size:64px;line-height:1.2;color:var(--navy);font-weight:600;max-width:680px}
    .domain{font-family:'Inter',sans-serif;font-weight:600;font-size:20px;
      letter-spacing:.2em;text-transform:uppercase;color:var(--ocean)}
  </style>
  <div class="frame">
    <div class="kicker">Outdoor &amp; Coastal Home</div>
    <h2>${name}</h2>
    <div class="domain">outdoorcoastalhome.com</div>
  </div>
`;

const boards = [
  'Outdoor Entertaining',
  'Coastal Decor',
  'Hamptons Style',
  'Backyard Ideas',
];

// ── Main profile picture — 500x500, same monogram/wordmark treatment used
// site-wide in Footer.astro ("O & H" in Pinyon Script over navy). Works
// cropped to a circle on both Pinterest and Instagram.
const profilePicture = () => `
  <style>${BASE_CSS}
    body{width:500px;height:500px;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(160deg, var(--navy), #14293544);
      background-color:var(--navy);}
    .mark{display:flex;flex-direction:column;align-items:center;gap:6px}
    .monogram{font-family:'Pinyon Script',cursive;font-weight:400;font-size:150px;
      color:var(--shell);line-height:1;letter-spacing:.02em;}
    .wordmark{font-family:'Inter',sans-serif;font-size:15px;font-weight:600;
      letter-spacing:.28em;text-transform:uppercase;color:var(--sand);}
  </style>
  <div class="mark">
    <div class="monogram">O &amp; H</div>
    <div class="wordmark">Outdoor &amp; Coastal Home</div>
  </div>
`;

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

mkdirSync('out-profile/highlights', { recursive: true });
mkdirSync('out-profile/boards', { recursive: true });

await page.setViewportSize({ width: 500, height: 500 });
{
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>${profilePicture()}</body></html>`;
  const file = resolve('out-profile/profile-picture.html');
  writeFileSync(file, html);
  await page.goto('file://' + file, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'out-profile/profile-picture.png' });
  console.log('✓ out-profile/profile-picture.png');
}

for (const [key, photoPath] of Object.entries(HIGHLIGHT_PHOTOS)) {
  await page.setViewportSize({ width: 1080, height: 1080 });
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>${highlightCover(photoPath)}</body></html>`;
  const file = resolve(`out-profile/highlights/${key}.html`);
  writeFileSync(file, html);
  await page.goto('file://' + file, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `out-profile/highlights/${key}.png` });
  console.log(`✓ out-profile/highlights/${key}.png`);
}

for (const name of boards) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  await page.setViewportSize({ width: 1000, height: 1000 });
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>${boardCover(name)}</body></html>`;
  const file = resolve(`out-profile/boards/${slug}.html`);
  writeFileSync(file, html);
  await page.goto('file://' + file, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `out-profile/boards/${slug}.png` });
  console.log(`✓ out-profile/boards/${slug}.png`);
}

await browser.close();
