/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the community-page template
import heroParser from './parsers/hero-full.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsPromoParser from './parsers/columns-promo.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — community-page (9 sections)
// Community page DOM (from https://gabrielwalt.github.io/wknd/community.html):
//   0: section.hero-section                                — Hero
//   1: section.section.inverse-section (centered+narrow)   — Statement
//   2: section.section.secondary-section (featured+index)  — Featured Story + How to Submit
//   3: section.section (article-card)                      — From the Wild (cards-article)
//   4: section.section.secondary-section (featured+article)— Reader Dispatches
//   5: section.section.inverse-section (narrow, no center) — What makes a great dispatch?
//   6: section.section.accent-section (grid+card)          — Join in (columns-promo)
//   7: section.section (faq-list)                          — Submission FAQ (accordion-faq)
//   8: section.section.inverse-section (centered, no narrow)— CTA
const PAGE_TEMPLATE = {
  name: 'community-page',
  description: 'Community page with hero, featured reader story, submission guidelines, dispatches, editorial standards, FAQ, and CTA',
  urls: [
    'https://gabrielwalt.github.io/wknd/community.html',
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
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'],
    },
    {
      name: 'columns-promo',
      instances: ['.accent-section .grid-layout.tablet-1-column:has(.card)'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
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
      name: 'Statement',
      selector: 'section:nth-of-type(2)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-3',
      name: 'Featured Story + How to Submit',
      selector: 'section:nth-of-type(3)',
      style: 'secondary',
      blocks: ['columns-featured', 'columns-numbered'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'From the Wild',
      selector: 'section:nth-of-type(4)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-5',
      name: 'Reader Dispatches',
      selector: 'section:nth-of-type(5)',
      style: 'secondary',
      blocks: ['columns-featured', 'cards-article'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-6',
      name: 'What Makes a Great Dispatch',
      selector: 'section:nth-of-type(6)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-7',
      name: 'Join In',
      selector: 'section:nth-of-type(7)',
      style: 'accent',
      blocks: ['columns-promo'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-8',
      name: 'Submission FAQ',
      selector: 'section:nth-of-type(8)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-9',
      name: 'CTA',
      selector: 'section:nth-of-type(9)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-featured': columnsFeaturedParser,
  'columns-numbered': columnsNumberedParser,
  'cards-article': cardsArticleParser,
  'columns-promo': columnsPromoParser,
  'accordion-faq': accordionFaqParser,
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
