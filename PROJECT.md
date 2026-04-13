# WKND Adventures — Project State

**Original site:** https://wknd-adventures.com/
**Local preview:** http://localhost:3000/content/wknd/{page}

---

## Blocks (13 total)

Mix of standalone blocks and block families with CSS variants.

| Block | Variants | CSS Notes |
|-------|----------|-----------|
| `hero` | `article` | Full-bleed overlay hero. Base (no variant) = landing pages with eyebrow, gradient overlay, CTA buttons. `article` = blog posts with breadcrumbs, tag pills, author avatar. |
| `cards` | `cards-article`, `cards-feature` | `cards-article` = image+body grid with hover effects. `cards-feature` = glass text-only cards (dark section). Shared internal classes: `cards-card-image`, `cards-card-body`. |
| `columns` | `columns-about`, `columns-promo`, `columns-pullquote` | 3 variants in one file. `columns-promo` uses `:has()` for narrow container. `columns-pullquote` has pull-quote dark panel. Shared internal class: `columns-img-col`. |
| `featured-article` | _(none)_ | Standalone block. Image + content side-by-side with tag pill, CTA button. Internal class: `featured-article-img-col`. |
| `editorial-index` | _(none)_ | Standalone block. Numbered items with large accent numbers. Grid layout: number + content. |
| `tabs` | _(none)_ | Generic tab container. Can nest any block inside panels. Base has inline card grid styling for activity browser. |
| `team-profile` | _(none)_ | Standalone block. Circular avatar + name/role + bio. Typically nested inside `tabs` on team pages. |
| `gallery` | _(none)_ | Standalone block. Photo grid. |
| `faq-list` | _(none)_ | Uses native `<details>/<summary>` with animated open/close. |
| `ticker` | _(none)_ | Horizontal scrolling tag ticker. |
| `header` | _(none)_ | Sticky nav bar with megamenu (3 panels: Explore, Stories, Info). Desktop hover+click, mobile hamburger. |
| `footer` | _(none)_ | Dark 4-column layout: brand+tagline, Explore links, Recent Stories links, Info links + bottom bar. |
| `fragment` | _(none)_ | EDS boilerplate fragment loader. |

### Block variant CSS selectors

```
.hero { ... }                     /* base hero (full-bleed overlay) — no variant needed */
.hero.article { ... }             /* variant for blog article pages */
.cards.cards-article { ... }
.cards.cards-feature { ... }
.columns.columns-about { ... }
.columns.columns-promo { ... }
.columns.columns-pullquote { ... }
.featured-article { ... }         /* standalone block */
.editorial-index { ... }          /* standalone block */
.faq-list { ... }                 /* standalone block */
.team-profile { ... }             /* standalone block, nestable in tabs */
```

### Container-level variant targeting

EDS generates `{block}-container` and `{block}-wrapper` divs using the **base** block name only. To target container/wrapper for a specific variant, use `:has()`:

```css
.columns-wrapper:has(.columns-promo) { max-width: var(--container-narrow-max-width); }
```

---

## Section Styles

Three section style variants used across the site:

| Style | CSS Class | Background | Text |
|-------|-----------|------------|------|
| `dark` | `.section.dark` | `var(--dark-color)` (#0f1a14) | white |
| `accent` | `.section.accent` | `var(--accent-color)` (#e8651a) | white |
| `secondary` | `.section.secondary` | `var(--light-color)` (#f0ece4) | default |

Usage counts: dark (20), secondary (11), accent (9).

---

## Design Tokens (styles.css)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--background-color` | `#fff` | Page background |
| `--text-color` | `#0f1a14` | Body text |
| `--text-color-muted` | `#7a8a80` | Gray-500, secondary text |
| `--text-color-subtle` | `#3d4f45` | Gray-400 |
| `--accent-color` | `#e8651a` | Orange accent, buttons |
| `--light-color` | `#f0ece4` | Secondary section bg |
| `--dark-color` | `#0f1a14` | Dark section bg, headings |
| `--cream-color` | `#f5f0e8` | Card hover bg |
| `--forest-color` | `#1a3a2e` | Deep green accent |
| `--border-color` | `#c8c2b8` | Gray-300, hover borders |
| `--border-color-light` | `#ddd8cf` | Gray-200, default borders |

### Typography
| Token | Value |
|-------|-------|
| `--body-font-family` | Instrument Sans |
| `--heading-font-family` | Syncopate |
| `--button-font-family` | Syncopate |

### Spacing
| Token | Value |
|-------|-------|
| `--container-max-width` | 1200px |
| `--container-narrow-max-width` | 768px |
| `--container-padding` | 0 24px |
| `--section-padding` | 48px 0 (mobile), 64px 0 (desktop) |

### Shared Component Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--card-border-radius` | `20px` | Cards, columns-promo, sidebar, gallery, tabs panels |
| `--card-hover-shadow` | `0 4px 20px rgb(0 0 0 / 8%)` | Hover shadow on cards, promo, tab cards |
| `--card-hover-transition` | `background-color 0.15s, border-color 0.15s, box-shadow 0.15s` | Shared card hover transition |
| `--tag-padding` | `4px 12px` | Tag pill padding (cards, columns-featured, hero-article) |
| `--tag-font-size` | `12px` | Tag pill font size |
| `--tag-letter-spacing` | `0.6px` | Tag pill letter spacing |
| `--text-on-dark` | `rgb(255 255 255 / 85%)` | Paragraph text on dark backgrounds |
| `--text-on-dark-muted` | `rgb(255 255 255 / 55%)` | Secondary text on dark backgrounds |
| `--glass-bg` | `rgb(255 255 255 / 6%)` | Glass card background (dark sections) |
| `--glass-border` | `rgb(255 255 255 / 12%)` | Glass card border (dark sections) |
| `--transition-fast` | `0.15s` | Quick interactions (hover, border) |
| `--transition-normal` | `0.3s ease` | Standard transitions (transform, accordion) |

### Buttons
Primary (black + amber shadow), Ghost (outline + amber shadow), Accent (amber + black shadow). All use offset `box-shadow` with hover lift and active press-down transitions.

---

## Pages (16 total)

### Landing pages
| Page | Blocks |
|------|--------|
| `index` | hero, featured-article, tabs, ticker, editorial-index, gallery, faq-list |

### Hub/landing pages
| Page | Blocks |
|------|--------|
| `adventures` | hero, featured-article, tabs, editorial-index, cards-article, columns-promo |
| `expeditions` | hero, editorial-index, tabs, cards-article, columns-promo |
| `destinations` | hero, featured-article, editorial-index, cards-article, columns-promo |
| `gear` | hero, featured-article, tabs, editorial-index, cards-article |

### Editorial/section pages
| Page | Blocks |
|------|--------|
| `field-notes` | hero, featured-article, tabs, columns-promo |
| `community` | hero, featured-article |
| `sustainability` | hero, editorial-index, featured-article |

### Informational pages
| Page | Blocks |
|------|--------|
| `about` | hero, columns-about, cards-feature, tabs (with nested team-profile), cards-article |
| `faq` | hero, faq-list, columns-promo, cards-article |

### Blog articles
| Page | Blocks |
|------|--------|
| `blog/patagonia-trek` | hero (article), columns-pullquote, gallery, cards-article |
| `blog/alpine-cycling` | hero (article), columns-pullquote, gallery, cards-article |
| `blog/kayaking-norway` | hero (article), columns-pullquote, gallery, cards-article |
| `blog/mountain-photography` | hero (article), columns-pullquote, gallery, cards-article |
| `blog/ultralight-backpacking` | hero (article), columns-pullquote, gallery, cards-article |
| `blog/yosemite-rock-climbing` | hero (article), columns-pullquote, gallery, cards-article |

---

## Import Infrastructure

### Import Script (tools/importer/)
Single unified import script (`import.js`) with content-driven block detection via `BLOCK_REGISTRY`.

### Parsers (tools/importer/parsers/) — 14 files
`hero-full.js`, `hero-article.js`, `featured-article.js`, `editorial-index.js`, `columns-gallery.js`, `columns-about.js`, `columns-sidebar.js`, `columns-promo.js`, `cards-article.js`, `cards-feature.js`, `tabs-activity.js`, `tabs-team.js`, `faq-list.js`, `ticker.js`

Parser output names (what goes into content HTML):
- `Hero` → `class="hero"` (base hero, no variant — used on all landing/hub/info pages)
- `Hero (article)` → `class="hero article"`
- `Cards (cards-article)` → `class="cards cards-article"`
- `Cards (cards-feature)` → `class="cards cards-feature"`
- `Featured Article` → `class="featured-article"` (standalone block)
- `Editorial Index` → `class="editorial-index"` (standalone block)
- `Columns (columns-about)` → `class="columns columns-about"`
- `Columns (columns-promo)` → `class="columns columns-promo"`
- `Columns (columns-pullquote)` → `class="columns columns-pullquote"`
- `Gallery` → `class="gallery"`
- `Tabs` → `class="tabs"` (generic container, can nest blocks)
- `Team Profile` → `class="team-profile"` (nested inside tabs on about page)
- `Faq List` → `class="faq-list"` (standalone block)
- `Ticker` → `class="ticker"`

### Transformers (tools/importer/transformers/)
- `wknd-cleanup.js` — removes nav, footer, scripts, etc.
- `wknd-sections.js` — creates section boundaries with section-metadata

### Bundling
```bash
npx esbuild tools/importer/import-{name}.js \
  --bundle --format=iife --global-name=CustomImportScript \
  --platform=browser --outfile=tools/importer/import-{name}.bundle.js
```
**Critical:** Must use `--format=iife --global-name=CustomImportScript`. ESM format will fail.

### Running imports
```bash
node /home/node/.excat-marketplace/excat/skills/excat-content-import/scripts/run-bulk-import.js \
  --import-script tools/importer/import-{name}.bundle.js \
  --urls tools/importer/urls-{name}.txt
```

---

## Block JS — DOM Restructuring Notes

### hero.js
The hero block restructures the EDS table DOM into a full-bleed background image layout:
- **Input:** 2-row table → `block > div(row) > div(cell) > p > img` (image row) + `block > div(row) > div(cell) > [content]` (content row)
- **Output:** `block > picture > img` (absolute-positioned background) + `block > div` (content overlay with z-index)
- The JS extracts `<img>` from the first row, wraps it in a new `<picture>`, then calls `block.replaceChildren(picture, contentCell)`.
- Images arrive inside `<p>` tags (not `<picture>`) because EDS only auto-wraps direct-div-child images in `<picture>`.

### columns.js
Detects image-only columns and adds `columns-img-col` class:
- **Primary check:** `col.querySelector('picture')` — for images that EDS has wrapped in `<picture>`
- **Fallback check:** `col.querySelector(':scope > p > img')` — for images inside `<p>` tags (typical from imports)
- Without this fallback, image columns don't get the `columns-img-col` class, breaking about/promo/pullquote layouts.

### featured-article.js
Same image detection pattern as columns.js but uses `featured-article-img-col` class.

### tabs.js
Generic tab container. Handles tab UI (buttons, ARIA, panel switching). Discovers and loads nested blocks inside tab panels. Also restructures inline card-like content (images + headings) into card divs for activity browser panels.

### team-profile.js
Detects avatar image column and adds `team-profile-avatar` / `team-profile-text` classes.

---

## Block CSS — Implementation Notes

### editorial-index
- Uses `border-top` on all items + `border-bottom` only on `:last-child` to avoid double borders between adjacent items.
- Number column: 48px (mobile) / 56px (desktop) Syncopate font, amber color.
- Desktop grid: `80px 1fr`.

### featured-article
- Image column uses `overflow: hidden` + `max-height` (20rem mobile, 400px desktop) with `object-fit: cover` to constrain images that are inside `<p>` wrappers.
- Tag pill targets `p:first-child` in content column (imported content uses `<p>Water</p>` not `<em>Water</em>`). Also supports `em` for future content corrections.
- "Read the Story" link is styled as a dark button via block CSS since imported content lacks `<strong>` wrapper for EDS button decoration.
- Footer layout: button paragraph uses `text-align: right`.

---

## Known Issues / Notes

- **Header/footer content files:** Nav and footer content lives at `/workspace/nav.plain.html` and `/workspace/footer.plain.html` (workspace root, NOT in `/content/`). The AEM CLI serves `.plain.html` from the workspace root at `/{name}.plain.html`.
- **Hero selector:** Original source uses `section.hero-section.hero-section--full` on some pages and `section.hero-section` on others. Import scripts now use both selectors as fallback: `['section.hero-section.hero-section--full', 'section.hero-section']`.
- **Bundle files in lint:** `.bundle.js` files are generated by esbuild and excluded from eslint via `.eslintignore`.
- **Consolidated CSS specificity:** Merged variant CSS files use `/* stylelint-disable no-descending-specificity */` because variant selectors naturally follow base selectors with different specificity chains.
- **`moveInstrumentation`:** This function does not exist in this project's `scripts.js`. Do NOT import it in block JS files.
- **Blog pages all use same block set:** All 6 blog articles share identical block structure.
- **EDS image wrapping:** Images inside `<p>` tags don't get `<picture>` wrappers from EDS. Block JS must handle both `<picture>` and bare `<img>` in `<p>` patterns. See AGENTS.md "EDS Image Handling" section.
- **Button decoration requires `<strong>`/`<em>` wrapper:** Plain `<a>` links in `<p>` tags don't get `.button` class from EDS. Import parsers should wrap CTA links in `<strong>` (primary) or `<em>` (secondary) for proper button decoration. Otherwise, block CSS must style links as buttons directly.
- **CSS selectors must match EDS DOM:** Original site DOM selectors (e.g., `img[alt*="avatar"]`, `em` for tags) may not match imported content structure. Use positional selectors (`p:first-child`, `p:nth-last-child(2) > img`) as fallbacks.
