/* eslint-disable */
/* global WebImporter */

/**
 * Parser for faq-list block.
 * Source: https://wknd-adventures.com/index.html
 * Selector: .faq-list
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.faq-item');
  const cells = [];

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    cells.push([question || '', answer || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Faq List',
    cells,
  });
  element.replaceWith(block);
}
