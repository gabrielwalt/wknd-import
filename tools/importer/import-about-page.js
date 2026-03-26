/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the about-page template
import heroParser from './parsers/hero-full.js';
import columnsAboutParser from './parsers/columns-about.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tabsTeamParser from './parsers/tabs-team.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION — about-page (9 sections)
// About page DOM (from https://gabrielwalt.github.io/wknd/about.html):
//   0: section.hero-section                              — Hero
//   1: section.section.accent-section (container--narrow container--centered) — Statement
//   2: section.section (grid-gap-xxl)                    — How It Started (columns-about)
//   3: section.section.inverse-section (feature-card)    — What We Believe (cards-feature)
//   4: section.section (tab-menu)                        — The Team (tabs-team)
//   5: section.section.secondary-section                 — Editorial Standard (default content)
//   6: section.section.inverse-section (container--narrow, no feature-card) — How We Fund (default content)
//   7: section.section (article-card)                    — From Our Editors (cards-article)
//   8: section.section.accent-section (container--centered, no --narrow) — CTA
const PAGE_TEMPLATE = {
  name: 'about-page',
  description: 'About page with hero, statement, origin story, values, team profiles, editorial standard, funding, editor picks, and CTA',
  urls: [
    'https://gabrielwalt.github.io/wknd/about.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-about',
      instances: ['.grid-layout.grid-gap-xxl.tablet-1-column'],
    },
    {
      name: 'cards-feature',
      instances: ['.inverse-section .grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'],
    },
    {
      name: 'tabs-team',
      instances: ['section.section:has(.tab-menu)'],
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
      name: 'Statement',
      selector: 'section.section.accent-section:has(> div.container--narrow)',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-xl'],
    },
    {
      id: 'section-3',
      name: 'How It Started',
      selector: 'section.section:has(.grid-gap-xxl)',
      style: null,
      blocks: ['columns-about'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'What We Believe',
      selector: 'section.section.inverse-section:has(.feature-card)',
      style: 'dark',
      blocks: ['cards-feature'],
      defaultContent: ['h2.h2-heading'],
    },
    {
      id: 'section-5',
      name: 'The Team',
      selector: 'section.section:has(.tab-menu)',
      style: null,
      blocks: ['tabs-team'],
      defaultContent: ['h2.h2-heading'],
    },
    {
      id: 'section-6',
      name: 'Editorial Standard',
      selector: 'section.section.secondary-section',
      style: 'secondary',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p'],
    },
    {
      id: 'section-7',
      name: 'How We Fund Our Work',
      selector: 'section.section.inverse-section:not(:has(.feature-card))',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p'],
    },
    {
      id: 'section-8',
      name: 'From Our Editors',
      selector: 'section.section:has(.article-card)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2.h2-heading'],
    },
    {
      id: 'section-9',
      name: 'CTA',
      selector: 'section.section.accent-section:not(:has(> div.container--narrow))',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-about': columnsAboutParser,
  'cards-feature': cardsFeatureParser,
  'tabs-team': tabsTeamParser,
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
