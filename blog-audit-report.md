# Blog Audit Report — Outdoor & Coastal Home Decor (Australia)

**Audit Date:** 2026-07-16
**Total Posts:** 42
**Average Score:** ~85/100

## Health Overview

| Metric | Count |
|---|---|
| Posts Scoring 90+ (Excellent) | 8 |
| Posts Scoring 70-89 (Good) | 30 |
| Posts Scoring 50-69 (Needs Work) | 3 |
| Posts Scoring <50 (Poor) | 1 |
| Broken/malformed internal link stubs | 5 files |
| Frontmatter missing tldr/faqs (no FAQ schema) | 2 files |
| Critical: unrendered template placeholders live in body | 1 file |
| Critical: text encoding corruption (mojibake) | 1 file |

Overall this is a **strong, disciplined content system** — consistent frontmatter (tldr, faqs, author, dates), AUD pricing, Australian source citations, first-hand narrative voice, dense internal linking. The issues found are almost all **pipeline/publishing bugs**, not writing-quality problems.

---

## Critical Issues (fix first)

### 1. `coastal-home-office-australia.md` — Score 47/100 — **Never finished publishing**
Raw unconverted placeholder tags are live in the published body text (readers see this literally):
`[INTERNAL-LINK: ... → /blog/...]`, `[IMAGE: ... - search: "..."]`, `[CHART: ...]`, `[PERSONAL EXPERIENCE]`, `[ORIGINAL DATA]` — appears 8+ times.
**Fix:** This post never completed the image/link/chart injection step of the writing pipeline. Underlying research is good — needs re-running through `/blog write` finishing steps, not a rewrite.

### 2. `12-outdoor-patio-decor-australia.md` — Score 60/100 — **Character encoding corruption**
Em-dashes and special characters render as `â€"` mojibake throughout title, description, and body (dozens of instances). Also missing `tldr`/`faqs` frontmatter (no FAQ schema).
**Fix:** Re-save the file as UTF-8 (likely was saved/edited as Windows-1252 at some point) and backfill `tldr`/`faqs` frontmatter to match sibling posts.

### 3. Broken placeholder link stubs (5 files)
Malformed single-character markdown links that render as visible dead links / 404s:
| File | Broken link(s) |
|---|---|
| `08-coastal-living-room-ideas-australia.md` | `[C](/blog/o)`, `[c](/blog/o)` |
| `17-modern-coastal-home-decor-australia.md` | `[A](/blog/u)`, `[a](/blog/u)` |
| `18-boho-coastal-home-decor-australia.md` | `[R](/blog/a)`, `[r](/blog/a)` |
| `22-summer-entertaining-ideas-australia.md` | `[E](/blog/a)`, `[2](/blog/3)` |
| `hamptons-style-bedroom-australia.md` | `[H](/blog/a)`, `[h](/blog/a)` |
| `backyard-landscaping-ideas-australia.md` | `[N](/blog/a)`, `[n](/blog/a)` |

These look like leftover artifacts from an automated internal-linking/find-replace step that truncated mid-string. **Fix:** find/remove these stub links across all 6 files — quick, mechanical cleanup, no content risk.

### 4. `backyard-landscaping-ideas-australia.md` — missing `tldr`/`faqs` frontmatter
Only file (besides #12 above) missing these fields — no Key Takeaways box, no FAQPage schema, dragging Technical (9/15) and AI Citation (10/20) scores down. Otherwise fine content.

---

## Per-Batch Averages

| Batch | Files | Avg Score |
|---|---|---|
| Batch 1 (posts 04–21) | 14 | 84/100 |
| Batch 2 (posts 22–23, coastal-dining etc.) | 14 | 87.4/100 |
| Batch 3 (hamptons/native-garden etc.) | 16 | ~84/100 |

## Top Performers (90+)
`beach-house-furniture-australia` (92), `coastal-dining-room-australia` (90), `outdoor-lounge-ideas-australia` (91), `02-australian-beach-house-decor-ideas` (90), `hamptons-style-kitchen-australia` (91), `indoor-plants-coastal-home-australia` (91), `native-garden-ideas-australia` (91), `australian-coastal-colour-palette` (90)

## Lowest Performers (needs work)
`coastal-home-office-australia` (47), `12-outdoor-patio-decor-australia` (60), `backyard-landscaping-ideas-australia` (69)

---

## Site-Wide Patterns

1. **Recurring templated phrasing** — 5 posts (coastal-dining-room, beach-house-furniture, coastal-bathroom/bedroom/kitchen-decor) repeat an identical "Key point:" bolded phrase 8–11 times each. Reads as formulaic/AI-pattern across the batch. Worth diversifying phrasing for burstiness.
2. **Boilerplate repetition** — `backyard-fire-pit-ideas-australia.md` repeats "Always check current fire restrictions before lighting any outdoor fire" verbatim 5 times — an AI-detectability flag.
3. **Thin source diversity** — most posts lean on a single repeatedly-cited source (Domain.com.au, Choice.com.au, or BOM) rather than varied citations, despite otherwise strong first-hand anecdotes.
4. **Internal link "unpublished" false alarms** — the parallel audit batches initially flagged links like `rattan-furniture-australia`, `coastal-kitchen-decor-australia`, `indoor-plants-coastal-home-australia`, `pool-area-ideas-australia`, `native-garden-ideas-australia`, `outdoor-lounge-ideas-australia`, `coastal-bedroom-decor-australia`, `australian-coastal-colour-palette`, `backyard-landscaping-ideas-australia`, `hamptons-style-bedroom-australia`, `coastal-dining-room-australia`, `outdoor-bbq-area-ideas-australia` as pointing to unpublished posts. **Corrected:** all of these files exist in the full 42-file site — those links are valid. No real orphan/cannibalization issue from this.
5. **Title/H1 mismatches (minor)** — `09-backyard-entertaining-ideas-australia` (title says "Zones," body says "ideas") and `19-summer-backyard-party-ideas-australia` (title drops "Ideas" present in H1).
6. **Author E-E-A-T is capped** — byline is a name only ("Badreddine Br"), no author bio page, credentials, or link. Adding an `/about` author page with real credentials/photo would lift E-E-A-T scores across all 42 posts.
7. **JSON-LD schema rendering unverified from markdown** — frontmatter (`tldr`, `faqs`) is present and rich, but whether the Astro template (`[slug].astro`) actually emits `BlogPosting`/`FAQPage` JSON-LD from it needs a direct check of the template, not just the content files.

---

## Prioritized Action Queue

| Priority | Post | Issue | Action |
|---|---|---|---|
| 1 | `coastal-home-office-australia.md` | Raw placeholder tags live in body | Re-run through image/link/chart injection pipeline |
| 2 | `12-outdoor-patio-decor-australia.md` | Encoding corruption + missing frontmatter | Fix UTF-8 encoding, add tldr/faqs |
| 3 | `backyard-landscaping-ideas-australia.md` | Missing tldr/faqs, 2 broken links | Add frontmatter fields, strip broken links |
| 4 | 6 files (see Critical #3) | Broken `[X](/blog/y)` stub links | Find/remove across all 6 files |
| 5 | Site-wide | No author bio/credentials page | Build `/about` page with real author E-E-A-T signals |
| 6 | 5 posts (coastal-* decor series) | Repetitive "Key point:" phrasing | Diversify section-ending phrasing |
| 7 | `backyard-fire-pit-ideas-australia.md` | Repeated boilerplate sentence 5x | Vary the fire-safety reminder wording |
| 8 | Template check | Verify JSON-LD schema output | Read `src/pages/blog/[slug].astro` schema logic directly |

---

## Suggested Next Steps
- Fix Critical items 1–4 first (mechanical, low-risk, highest impact)
- Run `/blog analyze coastal-home-office-australia.md` after the pipeline re-run to confirm score recovery
- Run `/blog geo <top posts>` to push AI-citation-ready posts further for ChatGPT/Perplexity/AI Overview surfaces
- Consider adding a real author bio page — cheapest E-E-A-T win across all 42 posts at once
