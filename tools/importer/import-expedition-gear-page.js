/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the expedition-gear-page template
import heroParser from './parsers/hero-full.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — expedition-gear-page (9 sections)
// Shared template for expeditions.html and gear.html (identical section structure).
// Expeditions page DOM (from https://gabrielwalt.github.io/wknd/expeditions.html):
//   0: section.hero-section                         — Hero (no --full)
//   1: section.section.accent-section (narrow+centered) — Accent Tagline
//   2: section.section.secondary-section (featured)  — Featured Article
//   3: section.section (tab-menu, NO tab-container)  — Activity Tabs (regular)
//   4: section.section.secondary-section (tab-container--wide + editorial) — Wide Tabs + Editorial
//   5: section.section (editorial-index)             — Editorial Index
//   6: section.section.secondary-section (blog-gear-list) — Gear Lists
//   7: section.section.inverse-section (feature-card) — Feature Cards
//   8: section.section.accent-section (centered)     — CTA
const PAGE_TEMPLATE = {
  name: 'expedition-gear-page',
  description: 'Expedition/gear page with hero, tagline, featured article, activity tabs, wide content tabs, editorial index, gear lists, feature cards, and CTA',
  urls: [
    'https://gabrielwalt.github.io/wknd/expeditions.html',
    'https://gabrielwalt.github.io/wknd/gear.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-featured',
      instances: ['.featured-article'],
    },
    {
      name: 'tabs',
      instances: ['section.section:not(:has(.tab-container)):has(.tab-menu)'],
    },
    {
      name: 'tabs-activity',
      instances: ['.tab-container.tab-container--wide'],
    },
    {
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'cards-feature',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.hero-section',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Accent Tagline',
      selector: 'section:nth-of-type(2)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-3',
      name: 'Featured Article',
      selector: 'section:nth-of-type(3)',
      style: 'secondary',
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Activity Tabs',
      selector: 'section:nth-of-type(4)',
      style: null,
      blocks: ['tabs'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-5',
      name: 'Wide Tabs + Editorial',
      selector: 'section:nth-of-type(5)',
      style: 'secondary',
      blocks: ['tabs-activity'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-6',
      name: 'Editorial Index',
      selector: 'section:nth-of-type(6)',
      style: null,
      blocks: ['columns-numbered'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-7',
      name: 'Gear Lists',
      selector: 'section:nth-of-type(7)',
      style: 'secondary',
      blocks: [],
      defaultContent: ['h2', 'h3', 'p', 'ul'],
    },
    {
      id: 'section-8',
      name: 'Feature Cards',
      selector: 'section:nth-of-type(8)',
      style: 'dark',
      blocks: ['cards-feature'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-9',
      name: 'CTA',
      selector: 'section:nth-of-type(9)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', 'p', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-featured': columnsFeaturedParser,
  'tabs': tabsActivityParser,
  'tabs-activity': tabsActivityParser,
  'columns-numbered': columnsNumberedParser,
  'cards-feature': cardsFeatureParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
