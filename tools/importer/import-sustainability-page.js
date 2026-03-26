/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the sustainability-page template
import heroParser from './parsers/hero-full.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import tabsTeamParser from './parsers/tabs-team.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — sustainability-page (10 sections)
// Sustainability page DOM (from https://gabrielwalt.github.io/wknd/sustainability.html):
//   0: section.hero-section                          — Hero
//   1: section.section.secondary-section (editorial-index) — Wild Ethics (columns-numbered)
//   2: section.section.secondary-section (featured)  — Featured Story (columns-featured)
//   3: section.section (tab-menu, article-card)      — By Topic (tabs-team pattern)
//   4: section.section (container--narrow)            — The Adventurer's Responsibility (default content)
//   5: section.section.secondary-section (feature-card) — The WKND Wild Ethics (cards-feature)
//   6: section.section.secondary-section (article-card)  — Places That Need Our Care (cards-article)
//   7: section.section.accent-section                — Practical Steps (default content)
//   8: section.section.inverse-section (blockquote)  — This is not optional (default content)
//   9: section.section.accent-section (centered)     — CTA
const PAGE_TEMPLATE = {
  name: 'sustainability-page',
  description: 'Sustainability page with hero, wild ethics principles, featured story, topic tabs, editorial content, ethics guidelines, articles, practical steps, pledge, and CTA',
  urls: [
    'https://gabrielwalt.github.io/wknd/sustainability.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'columns-featured',
      instances: ['.featured-article'],
    },
    {
      name: 'tabs-team',
      instances: ['section.section:has(.tab-menu)'],
    },
    {
      name: 'cards-feature',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'],
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
      name: 'Wild Ethics',
      selector: 'section:nth-of-type(2)',
      style: 'secondary',
      blocks: ['columns-numbered'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-3',
      name: 'Featured Story',
      selector: 'section:nth-of-type(3)',
      style: 'secondary',
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'By Topic',
      selector: 'section:nth-of-type(4)',
      style: null,
      blocks: ['tabs-team'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-5',
      name: 'The Adventurer\'s Responsibility',
      selector: 'section:nth-of-type(5)',
      style: null,
      blocks: [],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-6',
      name: 'The WKND Wild Ethics',
      selector: 'section:nth-of-type(6)',
      style: 'secondary',
      blocks: ['cards-feature'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-7',
      name: 'Places That Need Our Care',
      selector: 'section:nth-of-type(7)',
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-8',
      name: 'Practical Steps',
      selector: 'section:nth-of-type(8)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', 'p', 'ul'],
    },
    {
      id: 'section-9',
      name: 'This Is Not Optional',
      selector: 'section:nth-of-type(9)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2', 'p', 'blockquote'],
    },
    {
      id: 'section-10',
      name: 'CTA',
      selector: 'section:nth-of-type(10)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-numbered': columnsNumberedParser,
  'columns-featured': columnsFeaturedParser,
  'tabs-team': tabsTeamParser,
  'cards-feature': cardsFeatureParser,
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
