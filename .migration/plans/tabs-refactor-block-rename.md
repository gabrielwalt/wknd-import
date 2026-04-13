# Block Rename & Tabs Refactor Plan

## Overview

Two major changes:
1. **Rename blocks** to align with original site class names
2. **Refactor tabs** from monolithic block to generic tab container supporting nested blocks

## Rename Mapping

| Current Name | New Name | Type | Impact |
|---|---|---|---|
| `hero` (base) | `hero` | No change | — |
| `hero (hero-article)` | `hero (article)` | Variant rename | CSS, content HTML, parsers |
| `columns (columns-featured)` | `featured-article` | **New standalone block** | New folder, move CSS/JS, content HTML, parsers |
| `columns (columns-numbered)` | `editorial-index` | **New standalone block** | New folder, move CSS/JS, content HTML, parsers |
| `columns (columns-promo)` | `columns (columns-promo)` | No change | — |
| `columns (columns-sidebar)` | `columns (columns-pullquote)` | Variant rename | CSS, content HTML, parsers |
| `columns (columns-about)` | `columns (columns-about)` | No change | — |
| `cards (cards-article)` | `cards (cards-article)` | No change | — |
| `cards (cards-feature)` | `cards (cards-feature)` | No change | — |
| `tabs` / `tabs (tabs-team)` | `tabs` (generic container) | **Architecture refactor** | JS, CSS, content HTML, parsers |
| `gallery` | `gallery` | No change | — |
| `accordion-faq` | `faq-list` | **Folder rename** | New folder, content HTML, parsers |
| `ticker` | `ticker` | No change | — |

## Tabs Architecture Refactor

**Current:** Tabs block has two variants (`tabs` base with card-grid panels, `tabs-team` with profile panels). All styling and DOM restructuring lives inside `tabs.js` and `tabs.css`.

**New:** Tabs block becomes a **generic tab container** that:
- Handles only tab UI (tab buttons, panel switching, ARIA)
- Each tab panel can contain **any nested block** (article-card grids, team profiles, etc.)
- Panel content styling is handled by the nested block's own CSS

**Content structure change for tabs-team → tabs with nested team-profile block:**

Current content HTML:
```
| Tabs (tabs-team) |
| Tab Name | avatar + name + role + bio |
```

New content HTML:
```
| Tabs |
| Tab Name | Team Profile block table nested |
```

**New block: `team-profile`** — a small standalone block extracted from the current `tabs-team` variant. Handles circular avatar + name/role + bio layout. Can be used inside tabs or standalone.

The base tabs (activity browser with article cards) would nest `cards (cards-article)` content inside panels — or the tab panel card styling remains in tabs CSS as default panel card styling (since the cards inside tabs are not full `cards-article` blocks, they're a simpler inline card grid).

**Decision point:** The activity tab panels contain card-like content that is NOT authored as separate `cards-article` blocks — they are inline `<img> + <p> + <h4> + <p>` sequences inside each tab row. Options:
1. Keep the card styling in tabs.css for inline card content (simpler, matches current structure)
2. Create a separate `tab-card` or `article-card-mini` block for nested use (more modular but higher complexity)

**Recommended:** Option 1 — keep inline card styling in tabs.css. The team-profile case is the one that truly benefits from extraction into a nested block.

## Files Affected

### New block folders to create
- `blocks/featured-article/` — `featured-article.js`, `featured-article.css`
- `blocks/editorial-index/` — `editorial-index.js`, `editorial-index.css`
- `blocks/faq-list/` — `faq-list.js`, `faq-list.css`
- `blocks/team-profile/` — `team-profile.js`, `team-profile.css`

### Block folders to delete
- `blocks/accordion-faq/` (replaced by `blocks/faq-list/`)

### Block files to modify
- `blocks/hero/hero.css` — rename `.hero.hero-article` → `.hero.article`
- `blocks/hero/hero.js` — update variant check from `hero-article` to `article`
- `blocks/columns/columns.css` — remove featured, numbered, sidebar sections; rename sidebar → pullquote
- `blocks/columns/columns.js` — remove featured/numbered-specific logic if any
- `blocks/tabs/tabs.js` — strip to generic tab UI only, remove team-profile DOM restructuring and card restructuring
- `blocks/tabs/tabs.css` — strip to tab navigation + panel container only; remove card and team-profile styling

### Import infrastructure
- `tools/importer/import.js` — update `BLOCK_REGISTRY` names
- `tools/importer/parsers/columns-featured.js` → rename to `parsers/featured-article.js`, output `Featured Article`
- `tools/importer/parsers/columns-numbered.js` → rename to `parsers/editorial-index.js`, output `Editorial Index`
- `tools/importer/parsers/columns-sidebar.js` → update output to `Columns (columns-pullquote)`
- `tools/importer/parsers/hero-article.js` → update output to `Hero (article)`
- `tools/importer/parsers/accordion-faq.js` → rename to `parsers/faq-list.js`, output `Faq List`
- `tools/importer/parsers/tabs-team.js` → update to output `Tabs` with nested `Team Profile` block
- `tools/importer/parsers/tabs-activity.js` → output stays `Tabs` (unchanged)

### Content HTML (must be re-imported)
All 17 content files in `content/wknd/` need re-import after parser changes to reflect new block table names.

### Documentation
- `AGENTS.md` — update all block name references
- `PROJECT.md` — update block table, variant list, parser output names

### Metadata files
- `blocks/accordion-faq/metadata.json` → move to `blocks/faq-list/metadata.json`, update name
- `blocks/ticker/metadata.json` — no change (ticker name stays)

## Execution Order

### Phase 1: Create new standalone blocks
1. Create `blocks/featured-article/` with JS + CSS extracted from columns
2. Create `blocks/editorial-index/` with JS + CSS extracted from columns
3. Create `blocks/faq-list/` by renaming from accordion-faq
4. Create `blocks/team-profile/` with JS + CSS extracted from tabs-team variant

### Phase 2: Refactor existing blocks
5. Update `blocks/hero/hero.css` — rename `hero-article` → `article` variant
6. Update `blocks/hero/hero.js` — update variant class check
7. Strip `blocks/columns/columns.css` — remove featured, numbered sections; rename sidebar → pullquote
8. Strip `blocks/columns/columns.js` — clean up if needed
9. Refactor `blocks/tabs/tabs.js` — generic tab UI only
10. Refactor `blocks/tabs/tabs.css` — tab nav + panel container only; keep inline card styling

### Phase 3: Update import infrastructure
11. Rename/update parsers (featured-article, editorial-index, faq-list, hero-article, columns-pullquote, tabs-team)
12. Update `import.js` BLOCK_REGISTRY
13. Bundle import script

### Phase 4: Re-import content
14. Re-run bulk import for all pages to regenerate content HTML with new block names

### Phase 5: Clean up & verify
15. Delete old `blocks/accordion-faq/` folder
16. Run linter (`npm run lint`)
17. Start dev server and verify all pages render correctly
18. Update `AGENTS.md` and `PROJECT.md`

## Checklist

- [ ] Create `blocks/featured-article/featured-article.js` (extract from columns.js)
- [ ] Create `blocks/featured-article/featured-article.css` (extract from columns.css)
- [ ] Create `blocks/editorial-index/editorial-index.js` (extract from columns.js)
- [ ] Create `blocks/editorial-index/editorial-index.css` (extract from columns.css)
- [ ] Create `blocks/faq-list/faq-list.js` (rename from accordion-faq.js)
- [ ] Create `blocks/faq-list/faq-list.css` (rename from accordion-faq.css)
- [ ] Create `blocks/faq-list/metadata.json`
- [ ] Create `blocks/team-profile/team-profile.js` (extract from tabs.js team variant)
- [ ] Create `blocks/team-profile/team-profile.css` (extract from tabs.css team variant)
- [ ] Update `blocks/hero/hero.css` — `hero-article` → `article`
- [ ] Update `blocks/hero/hero.js` — variant class check
- [ ] Clean `blocks/columns/columns.css` — remove featured + numbered sections, rename sidebar → pullquote
- [ ] Clean `blocks/columns/columns.js` — if needed
- [ ] Refactor `blocks/tabs/tabs.js` — generic tab container
- [ ] Refactor `blocks/tabs/tabs.css` — strip team variant, keep card panel styling
- [ ] Rename parser `columns-featured.js` → `featured-article.js`, update block name output
- [ ] Rename parser `columns-numbered.js` → `editorial-index.js`, update block name output
- [ ] Rename parser `accordion-faq.js` → `faq-list.js`, update block name output
- [ ] Update parser `columns-sidebar.js` → output `Columns (columns-pullquote)`
- [ ] Update parser `hero-article.js` → output `Hero (article)`
- [ ] Update parser `tabs-team.js` → output `Tabs` with nested `Team Profile` block inside panel
- [ ] Update `tools/importer/import.js` BLOCK_REGISTRY
- [ ] Bundle import script
- [ ] Re-import all content pages
- [ ] Delete `blocks/accordion-faq/` folder
- [ ] Run `npm run lint` and fix issues
- [ ] Verify all pages render at localhost:3000
- [ ] Update `AGENTS.md`
- [ ] Update `PROJECT.md`
