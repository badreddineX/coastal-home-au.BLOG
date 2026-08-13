// Rehype plugin: adds the "01." / "1.1" heading-number decoration to every
// H2/H3 in a blog post AT BUILD TIME, replacing a client-side script that
// used to do this by rewriting h.textContent after the page had already
// painted. That client-side rewrite touched every heading in the article
// (7800px+ of content on longer posts) in one pass right after load, and
// PageSpeed traced the single largest layout shift on the page (CLS 0.123
// of a 0.133 total) directly to <article class="post-main"> -- exactly the
// element containing all those headings. Doing this in the markdown AST
// before HTML is ever sent to the browser means the numbered headings are
// correct on first paint, so there's nothing left to reflow.
import { visit } from 'unist-util-visit';

const H2_SKIP = new Set(['tl;dr', 'tl:dr', '—', '–']);

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(textOf).join('');
  return '';
}

// NOTE: heading id/anchor slugs pick up the "01."/"1.1" number prefix now
// (e.g. "01why-go-vertical..." instead of the old "why-go-vertical...").
// Astro's built-in heading-id step runs after user rehypePlugins and slugs
// whatever text is present at that point -- tried pre-setting node.properties.id
// here to preserve the old clean slugs, but Astro's step overwrites it
// regardless. Not worth fighting further: this site has ~7 total GSC
// impressions site-wide as of 2026-08-13, so there are no real inbound
// anchor links depending on the old slugs to break.

export default function rehypeNumberHeadings() {
  return (tree) => {
    let h2Counter = 0;
    let h3Counter = 0;

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;

      const fullText = textOf(node).trim();

      if (node.tagName === 'h2') {
        if (H2_SKIP.has(fullText.toLowerCase())) return;
        const stripped = fullText
          .replace(/^\d+\.\s*/, '')
          .replace(/^tip\s*\d+\s*[:–-]\s*/i, '')
          .trim();
        h2Counter++;
        h3Counter = 0;

        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['h2-num'] },
            children: [{ type: 'text', value: String(h2Counter).padStart(2, '0') + '.' }],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['h2-title'] },
            children: [{ type: 'text', value: stripped }],
          },
        ];
      } else {
        if (h2Counter === 0) h2Counter = 1;
        h3Counter++;
        const stripped = fullText.replace(/^tip\s*\d+\s*[:–-]\s*/i, '').trim();

        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['h3-num'] },
            children: [{ type: 'text', value: `${h2Counter}.${h3Counter}` }],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['h3-title'] },
            children: [{ type: 'text', value: stripped }],
          },
        ];
      }
    });
  };
}
