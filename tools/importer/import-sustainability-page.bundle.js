var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-sustainability-page.js
  var import_sustainability_page_exports = {};
  __export(import_sustainability_page_exports, {
    default: () => import_sustainability_page_default
  });

  // tools/importer/parsers/hero-full.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".hero-bg img");
    const eyebrow = element.querySelector(".hero-eyebrow");
    const heading = element.querySelector("h1, .h1-heading");
    const description = element.querySelector(".hero-lead, .paragraph-xl");
    const ctaLinks = element.querySelectorAll(".button-group a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctaLinks.forEach((link) => {
      const label = link.querySelector(".button-label");
      if (label) {
        link.textContent = label.textContent.trim();
      }
      contentCell.push(link);
    });
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-numbered.js
  function parse2(element, { document: document2 }) {
    const items = element.querySelectorAll(".editorial-index-item");
    const cells = [];
    items.forEach((item) => {
      const number = item.querySelector(".editorial-index-number");
      const content = item.querySelector(":scope > div");
      cells.push([number || "", content || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-numbered)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse3(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, :scope > a img");
    const tag = element.querySelector(".tag");
    const heading = element.querySelector("h2, .h2-heading");
    const description = element.querySelector(".paragraph-lg");
    const avatar = element.querySelector(".avatar img");
    const bylineName = element.querySelector(".article-byline-name");
    const bylineMeta = element.querySelector(".article-byline-meta");
    const contentCol = [];
    if (tag) contentCol.push(tag);
    if (heading) contentCol.push(heading);
    if (description) contentCol.push(description);
    if (avatar || bylineName || bylineMeta) {
      const bylineP = document2.createElement("p");
      if (avatar) bylineP.append(avatar);
      if (bylineName) bylineP.append(document2.createTextNode(" " + bylineName.textContent));
      if (bylineMeta) {
        bylineP.append(document2.createElement("br"));
        bylineP.append(document2.createTextNode(bylineMeta.textContent));
      }
      contentCol.push(bylineP);
    }
    const ctaLink = element.querySelector(".featured-article-footer > a, .article-byline + a");
    if (ctaLink) {
      const label = ctaLink.querySelector(".button-label");
      if (label) ctaLink.textContent = label.textContent.trim();
      contentCol.push(ctaLink);
    }
    const cells = [
      [image || "", contentCol]
    ];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-featured)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-team.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    tabButtons.forEach((button, i) => {
      const tabLabel = document2.createElement("div");
      tabLabel.textContent = button.textContent.trim();
      const tabContent = document2.createElement("div");
      const pane = tabPanes[i];
      if (pane) {
        const profileImg = pane.querySelector(".profile-circle img");
        if (profileImg) {
          const img = profileImg.cloneNode(true);
          tabContent.appendChild(img);
        }
        const name = pane.querySelector(".profile-name");
        if (name) {
          const h3 = document2.createElement("h3");
          h3.textContent = name.textContent.trim();
          tabContent.appendChild(h3);
        }
        const role = pane.querySelector(".profile-name + p");
        if (role) {
          const em = document2.createElement("em");
          em.textContent = role.textContent.trim();
          const p = document2.createElement("p");
          p.appendChild(em);
          tabContent.appendChild(p);
        }
        const bioContainer = pane.querySelector(".team-profile-bio");
        if (bioContainer) {
          const paragraphs = bioContainer.querySelectorAll("p");
          paragraphs.forEach((para) => {
            const newP = document2.createElement("p");
            newP.textContent = para.textContent.trim();
            tabContent.appendChild(newP);
          });
        }
      }
      cells.push([tabLabel, tabContent]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Tabs (tabs-team)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".feature-card");
    cards.forEach((card) => {
      const row = document2.createElement("div");
      const heading = card.querySelector("h3");
      if (heading) {
        const h3 = document2.createElement("h3");
        h3.textContent = heading.textContent.trim();
        row.appendChild(h3);
      }
      const desc = card.querySelector("p");
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        row.appendChild(p);
      }
      const link = card.querySelector("a");
      if (link) {
        const a = document2.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        row.appendChild(a);
      }
      cells.push([row]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-feature)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse6(element, { document: document2 }) {
    const cards = element.querySelectorAll(".article-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img");
      const col1 = document2.createElement("div");
      if (img) {
        col1.appendChild(img.cloneNode(true));
      }
      const col2 = document2.createElement("div");
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagP = document2.createElement("p");
        tagP.textContent = tag.textContent.trim();
        col2.appendChild(tagP);
      }
      const title = card.querySelector("h3, h5");
      if (title) {
        const h3 = document2.createElement("h3");
        h3.textContent = title.textContent.trim();
        col2.appendChild(h3);
      }
      const desc = card.querySelector(".paragraph-sm");
      if (desc) {
        const descP = document2.createElement("p");
        descP.textContent = desc.textContent.trim();
        col2.appendChild(descP);
      }
      const authorDate = card.querySelector(".utility-text-secondary");
      if (authorDate) {
        const authorP = document2.createElement("p");
        authorP.innerHTML = `<em>${authorDate.textContent.trim()}</em>`;
        col2.appendChild(authorP);
      }
      const href = card.getAttribute("href");
      if (href) {
        const linkP = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = "Read More";
        linkP.appendChild(a);
        col2.appendChild(linkP);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        ".footer",
        ".skip-link",
        "noscript",
        "link",
        "iframe"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      const sourceUrl = payload.params && payload.params.originalURL;
      if (sourceUrl) {
        element.querySelectorAll("img").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("blob:")) {
            try {
              img.setAttribute("src", new URL(src, sourceUrl).href);
            } catch (e) {
            }
          }
        });
      }
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-sustainability-page.js
  var PAGE_TEMPLATE = {
    name: "sustainability-page",
    description: "Sustainability page with hero, wild ethics principles, featured story, topic tabs, editorial content, ethics guidelines, articles, practical steps, pledge, and CTA",
    urls: [
      "https://gabrielwalt.github.io/wknd/sustainability.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.hero-section"]
      },
      {
        name: "columns-numbered",
        instances: [".editorial-index"]
      },
      {
        name: "columns-featured",
        instances: [".featured-article"]
      },
      {
        name: "tabs-team",
        instances: ["section.section:has(.tab-menu)"]
      },
      {
        name: "cards-feature",
        instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.hero-section",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Wild Ethics",
        selector: "section:nth-of-type(2)",
        style: "secondary",
        blocks: ["columns-numbered"],
        defaultContent: ["h2"]
      },
      {
        id: "section-3",
        name: "Featured Story",
        selector: "section:nth-of-type(3)",
        style: "secondary",
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "By Topic",
        selector: "section:nth-of-type(4)",
        style: null,
        blocks: ["tabs-team"],
        defaultContent: ["h2"]
      },
      {
        id: "section-5",
        name: "The Adventurer's Responsibility",
        selector: "section:nth-of-type(5)",
        style: null,
        blocks: [],
        defaultContent: ["h2", "p"]
      },
      {
        id: "section-6",
        name: "The WKND Wild Ethics",
        selector: "section:nth-of-type(6)",
        style: "secondary",
        blocks: ["cards-feature"],
        defaultContent: ["h2"]
      },
      {
        id: "section-7",
        name: "Places That Need Our Care",
        selector: "section:nth-of-type(7)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: ["h2"]
      },
      {
        id: "section-8",
        name: "Practical Steps",
        selector: "section:nth-of-type(8)",
        style: "accent",
        blocks: [],
        defaultContent: ["h2", "p", "ul"]
      },
      {
        id: "section-9",
        name: "This Is Not Optional",
        selector: "section:nth-of-type(9)",
        style: "dark",
        blocks: [],
        defaultContent: ["h2", "p", "blockquote"]
      },
      {
        id: "section-10",
        name: "CTA",
        selector: "section:nth-of-type(10)",
        style: "accent",
        blocks: [],
        defaultContent: ["h2", ".button-group"]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "columns-numbered": parse2,
    "columns-featured": parse3,
    "tabs-team": parse4,
    "cards-feature": parse5,
    "cards-article": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_sustainability_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_sustainability_page_exports);
})();
