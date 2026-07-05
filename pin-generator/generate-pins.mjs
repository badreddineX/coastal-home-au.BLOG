// Pinterest pin generator for coastalhomeau.com.au — light/airy/blue "sea air" kit
// A = Full-bleed bright (navy scrim, sand kicker), B = Split (season/AUD hook kicker),
// C = Framed (ocean frame; supports colour-swatch strip instead of photo via "swatches").
// Headlines support <em>word</em> → italic accent.
// Usage: node generate-pins-au.mjs [pins-au.json]

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@500;600;700&display=swap" rel="stylesheet">`;

const BASE_CSS = `
  :root{ --shell:#FDFCFB; --ocean:#2E6F94; --navy:#1B3A4B; --sand:#D4B896; }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1000px;height:1500px;overflow:hidden}
  .kicker{font-family:'Inter',sans-serif;font-weight:700;font-size:26px;
          letter-spacing:.28em;text-transform:uppercase;color:var(--sand)}
  .domain{font-family:'Inter',sans-serif;font-weight:600;font-size:23px;
          letter-spacing:.22em;text-transform:uppercase}
  h2{font-family:'Playfair Display',serif;font-weight:500}
  h2 em{font-style:italic}
`;

const swatchStrip = (colors) =>
  `<div class="swatches">` +
  colors.map((c) => `<div style="background:${c}"></div>`).join('') +
  `</div>`;

const templates = {
  // ===== A · FULL-BLEED — bright coastal photo, navy scrim, sand kicker =====
  A: (p) => `
    <style>${BASE_CSS}
      body{display:flex;flex-direction:column;justify-content:flex-end;padding:96px 88px;
        background:
          linear-gradient(180deg, rgba(27,58,75,0) 36%, rgba(27,58,75,.45) 60%, rgba(20,44,58,.92) 100%),
          url('${p.photo}') center/cover no-repeat;}
      .accent-rule{width:60px;height:2px;background:var(--sand);margin-bottom:26px}
      .kicker{margin-bottom:24px}
      h2{font-size:88px;line-height:1.16;color:var(--shell);margin-bottom:38px;
         text-shadow:0 2px 26px rgba(11,30,40,.4)}
      h2 em{color:var(--sand)}
      .domain{color:rgba(253,252,251,.9)}
    </style>
    <div class="accent-rule"></div>
    <div class="kicker">${p.kicker}</div>
    <h2>${p.headline}</h2>
    <div class="domain">${p.domain}</div>`,

  // ===== B · SPLIT — photo top half, shell panel, season/AUD hook in sand =====
  B: (p) => `
    <style>${BASE_CSS}
      body{background:var(--shell);display:flex;flex-direction:column}
      .photo{height:52%;background:url('${p.photo}') center/cover no-repeat;
             box-shadow:inset 0 -40px 60px -50px rgba(27,58,75,.35);
             filter:brightness(1.05) saturate(1.05)}
      .panel{flex:1;padding:72px 88px 64px;display:flex;flex-direction:column}
      .txt{margin:auto 0}
      .kicker{margin-bottom:26px}
      h2{font-size:78px;line-height:1.18;color:var(--navy)}
      h2 em{color:var(--ocean)}
      .rule{height:2px;background:var(--ocean);margin-bottom:24px}
      .bottom{display:flex;justify-content:space-between;align-items:center}
      .domain{color:var(--ocean)}
      .cta{font-family:'Inter',sans-serif;font-weight:700;font-size:22px;
           letter-spacing:.18em;text-transform:uppercase;color:var(--sand)}
    </style>
    <div class="photo"></div>
    <div class="panel">
      <div class="txt">
        <div class="kicker">${p.kicker}</div>
        <h2>${p.headline}</h2>
      </div>
      <div class="cta-row">
        <div class="rule"></div>
        <div class="bottom">
          <div class="domain">${p.domain}</div>
          <div class="cta">Read&nbsp;→</div>
        </div>
      </div>
    </div>`,

  // ===== C · FRAMED — shell ground, ocean frame; photo OR swatch strip =====
  C: (p) => `
    <style>${BASE_CSS}
      body{background:var(--shell);padding:46px}
      .frame{height:100%;border:3px solid var(--ocean);display:flex;flex-direction:column;
             align-items:center;text-align:center;padding:100px 72px 82px}
      .kicker{margin-bottom:28px;display:flex;align-items:center;gap:18px}
      .kicker::before,.kicker::after{content:'';width:26px;height:1px;background:var(--sand)}
      h2{font-size:78px;line-height:1.22;color:var(--ocean);margin-bottom:64px}
      h2 em{color:var(--navy)}
      .photo{width:76%;flex:1;border-radius:12px;margin-bottom:58px;
             background:url('${p.photo}') center/cover no-repeat;
             box-shadow:0 24px 50px -28px rgba(27,58,75,.35);
             filter:brightness(1.05) saturate(1.05)}
      .swatches{width:76%;flex:1;border-radius:12px;margin-bottom:58px;overflow:hidden;
                display:flex;box-shadow:0 24px 50px -28px rgba(27,58,75,.35)}
      .swatches div{flex:1}
      .domain{color:var(--ocean)}
    </style>
    <div class="frame">
      <div class="kicker">${p.kicker}</div>
      <h2>${p.headline}</h2>
      ${p.swatches ? swatchStrip(p.swatches) : '<div class="photo"></div>'}
      <div class="domain">${p.domain}</div>
    </div>`,
};

const pins = JSON.parse(readFileSync(process.argv[2] ?? 'pins-au.json', 'utf8'));
mkdirSync('out-au', { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 } });

for (const pin of pins) {
  const photo = pin.photo && !pin.photo.startsWith('http') ? 'file://' + resolve(pin.photo) : pin.photo;
  const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>` +
    templates[pin.template]({ ...pin, photo }) + '</body></html>';
  const file = resolve(`out-au/${pin.slug}-${pin.template}.html`);
  writeFileSync(file, html);
  await page.goto('file://' + file, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `out-au/${pin.slug}-${pin.template}.png` });
  console.log(`✓ out-au/${pin.slug}-${pin.template}.png`);
}
await browser.close();
