/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the destinations-page template
import heroParser from './parsers/hero-full.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — destinations-page (9 sections)
// Destinations page DOM (from https://gabrielwalt.github.io/wknd/destinations.html):
//   0: section.hero-section                         — Hero (no --full)
//   1: section.section.accent-section (narrow)      — Flagship Expedition
//   2: section.section (article-card grid, 3-col)   — Our Expeditions
//   3: section.section.secondary-section (editorial) — What an Expedition Demands
//   4: section.section (tab-container--wide)         — Full Accounts
//   5: section.section.secondary-section (editorial) — The Gear You'll Actually Need
//   6: section.section.accent-section (narrow+centered, checklist) — Pre-Departure Checklist
//   7: section.section.inverse-section (narrow)      — What's Next
//   8: section.section.inverse-section (2col cards)  — Two-Card CTA
const PAGE_TEMPLATE = {
  name: 'destinations-page',
  description: 'Destinations page with hero, flagship expedition, article cards, editorial indexes, tabbed content, checklist, and CTAs',
  urls: [
    'https://gabrielwalt.github.io/wknd/destinations.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'],
    },
    {
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'tabs-activity',
      instances: ['.tab-container.tab-container--wide'],
    },
    {
      name: 'columns-promo',
      instances: ['.grid-layout.grid-layout--2col:has(.card)'],
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
      name: 'Flagship Expedition',
      selector: 'section:nth-of-type(2)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-3',
      name: 'Our Expeditions',
      selector: 'section:nth-of-type(3)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-4',
      name: 'What an Expedition Demands',
      selector: 'section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['columns-numbered'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-5',
      name: 'Full Accounts',
      selector: 'section:nth-of-type(5)',
      style: null,
      blocks: ['tabs-activity'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-6',
      name: 'The Gear You\'ll Actually Need',
      selector: 'section:nth-of-type(6)',
      style: 'secondary',
      blocks: ['columns-numbered'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-7',
      name: 'Pre-Departure Checklist',
      selector: 'section:nth-of-type(7)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', 'ul', '.button-group'],
    },
    {
      id: 'section-8',
      name: 'What\'s Next',
      selector: 'section:nth-of-type(8)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', 'p', 'a.button'],
    },
    {
      id: 'section-9',
      name: 'Two-Card CTA',
      selector: 'section:nth-of-type(9)',
      style: 'dark',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'cards-article': cardsArticleParser,
  'columns-numbered': columnsNumberedParser,
  'tabs-activity': tabsActivityParser,
  'columns-promo': columnsPromoParser,
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
