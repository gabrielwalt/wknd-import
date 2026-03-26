# WKND Adventures — Project State

**Original site:** https://gabrielwalt.github.io/wknd/
**Local preview:** http://localhost:3000/content/wknd/{page}

---

## Blocks (10 total)

Blocks use EDS variant convention: `Block (variant)` in authoring → `class="block variant"` in HTML.
All variants share a single CSS/JS file under the base block folder.

| Block | Variants | CSS Notes |
|-------|----------|-----------|
| `hero` | `hero-article` | Full-bleed overlay hero. Base (no variant) = landing pages with eyebrow, gradient overlay, CTA buttons. `hero-article` = blog posts with breadcrumbs, tag pills, author avatar. |
| `cards` | `cards-article`, `cards-feature` | `cards-article` = image+body grid with hover effects. `cards-feature` = glass text-only cards (dark section). Shared internal classes: `cards-card-image`, `cards-card-body`. |
| `columns` | `columns-about`, `columns-numbered`, `columns-featured`, `columns-promo`, `columns-sidebar` | 5 variants in one file. `columns-promo` uses `:has()` for narrow container. `columns-sidebar` has pull-quote dark panel. Shared internal class: `columns-img-col`. |
| `tabs` | `tabs-team` | Base = activity browser (card grid panels). `tabs-team` = profile layout with circular avatars. Generic classes: `tabs-list`, `tabs-panel`, `tabs-tab`. |
| `gallery` | _(none)_ | Standalone block (renamed from columns-gallery). Photo grid. |
| `accordion-faq` | _(none)_ | Uses native `<details>/<summary>`. |
| `ticker` | _(none)_ | Horizontal scrolling tag ticker. |
| `header` | _(none)_ | Sticky nav bar with megamenu (3 panels: Explore, Stories, Info). Desktop hover+click, mobile hamburger. |
| `footer` | _(none)_ | Dark 4-column layout: brand+tagline, Explore links, Recent Stories links, Info links + bottom bar. |
| `fragment` | _(none)_ | EDS boilerplate fragment loader. |

### Block variant CSS selectors

```
.hero { ... }                     /* base hero (full-bleed overlay) — no variant needed */
.hero.hero-article { ... }        /* variant for blog article pages */
.cards.cards-article { ... }
.cards.cards-feature { ... }
.columns.columns-about { ... }
.columns.columns-numbered { ... }
.columns.columns-featured { ... }
.columns.columns-promo { ... }
.columns.columns-sidebar { ... }
.tabs.tabs-team { ... }
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

## Pages (16 total, 10 templates)

### Homepage (import-homepage.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `index` | 9 (dark, secondary, dark, dark, secondary, dark, accent + 2 unstyled) | hero, columns-featured, tabs, ticker, columns-numbered, gallery, accordion-faq |

### Hub landing — Adventures (import-hub-landing-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `adventures` | 8 (dark, accent, secondary, secondary, secondary, dark + 2 unstyled) | hero, columns-featured, tabs, columns-numbered, cards-article, columns-promo |

### Destinations (import-destinations-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `destinations` | 9 (dark, accent, secondary, secondary, accent, dark, dark + 2 unstyled) | hero, cards-article, columns-numbered (×2), tabs, columns-promo |

### Expeditions & Gear (import-expedition-gear-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `expeditions` | 9 (dark, accent, secondary, secondary, secondary, dark, accent + 2 unstyled) | hero, columns-featured, tabs (regular), tabs (wide), columns-numbered, cards-feature |
| `gear` | 9 (dark, accent, secondary, secondary, secondary, dark, accent + 2 unstyled) | hero, columns-featured, tabs (regular), tabs (wide), columns-numbered, cards-feature |

### Editorial section — Field Notes (import-editorial-section-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `field-notes` | 7 (dark, dark, secondary, dark, secondary, dark + 1 unstyled) | hero, columns-featured, tabs, columns-promo, columns-numbered |

### Community (import-community-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `community` | 9 (dark, dark, secondary, secondary, dark, accent, dark + 2 unstyled) | hero, columns-featured, columns-numbered, cards-article, columns-promo, accordion-faq |

### Sustainability (import-sustainability-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `sustainability` | 10 (dark, secondary, secondary, secondary, secondary, accent, dark, accent + 2 unstyled) | hero, columns-numbered, columns-featured, tabs-team, cards-feature, cards-article |

### About (import-about-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `about` | 9 (dark, accent, dark, secondary, dark, accent + 3 unstyled) | hero, columns-about, cards-feature, tabs-team, cards-article |

### FAQ (import-faq-page.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `faq` | 9 (dark, accent, secondary, secondary, secondary, dark + 3 unstyled) | hero, columns-promo, accordion-faq, cards-article |

### Blog articles (import-blog-article.js)
| Page | Sections | Blocks |
|------|----------|--------|
| `blog/patagonia-trek` | 5 (dark, secondary, dark + 2 unstyled) | hero-article, columns-sidebar, gallery, cards-article |
| `blog/alpine-cycling` | 5 | same as above |
| `blog/kayaking-norway` | 5 | same as above |
| `blog/mountain-photography` | 5 | same as above |
| `blog/ultralight-backpacking` | 5 | same as above |
| `blog/yosemite-rock-climbing` | 5 | same as above |

---

## Import Infrastructure

### Import Scripts (tools/importer/) — 10 scripts, 1:1 with templates
| Script | Template | Pages |
|--------|----------|-------|
| `import-homepage.js` | homepage | index |
| `import-hub-landing-page.js` | hub-landing-page | adventures |
| `import-destinations-page.js` | destinations-page | destinations |
| `import-expedition-gear-page.js` | expedition-gear-page | expeditions, gear |
| `import-editorial-section-page.js` | editorial-section-page | field-notes |
| `import-community-page.js` | community-page | community |
| `import-sustainability-page.js` | sustainability-page | sustainability |
| `import-about-page.js` | about-page | about |
| `import-faq-page.js` | faq-page | faq |
| `import-blog-article.js` | blog-article | 6 blog posts |

### Parsers (tools/importer/parsers/) — 14 files
`hero-full.js`, `hero-article.js`, `columns-featured.js`, `columns-numbered.js`, `columns-gallery.js`, `columns-about.js`, `columns-sidebar.js`, `columns-promo.js`, `cards-article.js`, `cards-feature.js`, `tabs-activity.js`, `tabs-team.js`, `accordion-faq.js`, `ticker.js`

Parser output names (what goes into content HTML):
- `Hero` → `class="hero"` (base hero, no variant — used on all landing/hub/info pages)
- `Hero (hero-article)` → `class="hero hero-article"`
- `Cards (cards-article)` → `class="cards cards-article"`
- `Cards (cards-feature)` → `class="cards cards-feature"`
- `Columns (columns-about)` → `class="columns columns-about"`
- `Columns (columns-numbered)` → `class="columns columns-numbered"`
- `Columns (columns-featured)` → `class="columns columns-featured"`
- `Columns (columns-promo)` → `class="columns columns-promo"`
- `Columns (columns-sidebar)` → `class="columns columns-sidebar"`
- `Gallery` → `class="gallery"`
- `Tabs` → `class="tabs"`
- `Tabs (tabs-team)` → `class="tabs tabs-team"`

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
- Without this fallback, image columns don't get the `columns-img-col` class, breaking featured/about/sidebar layouts.

---

## Block CSS — Variant Implementation Notes

### columns-numbered
- Uses `border-top` on all items + `border-bottom` only on `:last-child` to avoid double borders between adjacent items.
- Number column: 48px (mobile) / 56px (desktop) Syncopate font, amber color.
- Desktop grid: `80px 1fr`.

### columns-featured
- Image column uses `overflow: hidden` + `max-height` (20rem mobile, 400px desktop) with `object-fit: cover` to constrain images that are inside `<p>` wrappers.
- Tag pill targets `p:first-child` in content column (imported content uses `<p>Water</p>` not `<em>Water</em>`). Also supports `em` for future content corrections.
- Avatar targets `p:nth-last-child(2) > img` (positional, since imported content lacks `alt="avatar"` or `width="56"` attributes).
- "Read the Story" link is styled as an accent button via block CSS since imported content lacks `<strong>` wrapper for EDS button decoration.
- Footer layout: byline paragraph uses flex, button paragraph uses `text-align: right`.

---

## Known Issues / Notes

- **Header/footer content files:** Nav and footer content lives at `/workspace/nav.plain.html` and `/workspace/footer.plain.html` (workspace root, NOT in `/content/`). The AEM CLI serves `.plain.html` from the workspace root at `/{name}.plain.html`.
- **Hero selector:** Original source uses `section.hero-section.hero-section--full` on adventures and `section.hero-section` (without `--full`) on destinations/expeditions/gear. Dedicated templates for each page group use the correct hero selector.
- **Bundle files in lint:** `.bundle.js` files are generated by esbuild and excluded from eslint via `.eslintignore`.
- **Consolidated CSS specificity:** Merged variant CSS files use `/* stylelint-disable no-descending-specificity */` because variant selectors naturally follow base selectors with different specificity chains.
- **`moveInstrumentation`:** This function does not exist in this project's `scripts.js`. Do NOT import it in block JS files.
- **Blog pages all use same block set:** All 6 blog articles share identical block structure.
- **EDS image wrapping:** Images inside `<p>` tags don't get `<picture>` wrappers from EDS. Block JS must handle both `<picture>` and bare `<img>` in `<p>` patterns. See AGENTS.md "EDS Image Handling" section.
- **Button decoration requires `<strong>`/`<em>` wrapper:** Plain `<a>` links in `<p>` tags don't get `.button` class from EDS. Import parsers should wrap CTA links in `<strong>` (primary) or `<em>` (secondary) for proper button decoration. Otherwise, block CSS must style links as buttons directly.
- **CSS selectors must match EDS DOM:** Original site DOM selectors (e.g., `img[alt*="avatar"]`, `em` for tags) may not match imported content structure. Use positional selectors (`p:first-child`, `p:nth-last-child(2) > img`) as fallbacks.
