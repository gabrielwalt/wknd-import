/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the faq-page template
import heroParser from './parsers/hero-full.js';
import columnsPromoParser from './parsers/columns-promo.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — faq-page (9 sections)
// FAQ page DOM (from https://gabrielwalt.github.io/wknd/faq.html):
//   0: section.hero-section                        — Hero
//   1: section.section.accent-section               — FAQ Categories (columns-promo with card links)
//   2: section.section (nth-of-type 3)              — Planning & Adventures FAQ (accordion-faq)
//   3: section.section.secondary-section (nth 4)    — Contributing Stories FAQ (accordion-faq)
//   4: section.section (nth-of-type 5)              — Planning Your Trip FAQ (accordion-faq)
//   5: section.section.secondary-section (nth 6)    — About WKND Content FAQ (accordion-faq)
//   6: section.section (nth-of-type 7)              — Contributing & Community FAQ (accordion-faq)
//   7: section.section.secondary-section (nth 8)    — Popular Starting Points (cards-article)
//   8: section.section.inverse-section              — CTA
const PAGE_TEMPLATE = {
  name: 'faq-page',
  description: 'FAQ page with hero, category cards, alternating FAQ accordion sections, popular articles, and CTA',
  urls: [
    'https://gabrielwalt.github.io/wknd/faq.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-promo',
      instances: ['.accent-section .grid-layout.tablet-1-column:has(.card)'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'],
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
      name: 'FAQ Categories',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Planning & Adventures FAQ',
      selector: 'section:nth-of-type(3)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-4',
      name: 'Contributing Stories FAQ',
      selector: 'section:nth-of-type(4)',
      style: 'secondary',
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-5',
      name: 'Planning Your Trip FAQ',
      selector: 'section:nth-of-type(5)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-6',
      name: 'About WKND Content FAQ',
      selector: 'section:nth-of-type(6)',
      style: 'secondary',
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-7',
      name: 'Contributing & Community FAQ',
      selector: 'section:nth-of-type(7)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-8',
      name: 'Popular Starting Points',
      selector: 'section:nth-of-type(8)',
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-9',
      name: 'CTA',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', 'p', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-promo': columnsPromoParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
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
