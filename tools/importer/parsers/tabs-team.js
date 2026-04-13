/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs with team-profile nested blocks.
 * Source: https://wknd-adventures.com/about.html
 * Selector: section.section:has(.tab-menu):has(.profile-circle)
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find tab buttons and tab panes
  const tabButtons = element.querySelectorAll('.tab-menu .tab-menu-link');
  const tabPanes = element.querySelectorAll('.tab-pane');

  tabButtons.forEach((button, i) => {
    const tabLabel = document.createElement('div');
    tabLabel.textContent = button.textContent.trim();

    // Build a nested Team Profile block inside this tab panel
    const pane = tabPanes[i];
    const profileCells = [];

    if (pane) {
      // Avatar column
      const avatarCol = document.createElement('div');
      const profileImg = pane.querySelector('.profile-circle img');
      if (profileImg) {
        avatarCol.appendChild(profileImg.cloneNode(true));
      }
      const name = pane.querySelector('.profile-name');
      if (name) {
        const nameP = document.createElement('p');
        nameP.textContent = name.textContent.trim();
        avatarCol.appendChild(nameP);
      }

      // Text column
      const textCol = document.createElement('div');
      const role = pane.querySelector('.profile-name + p');
      if (role) {
        const em = document.createElement('em');
        em.textContent = role.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(em);
        textCol.appendChild(p);
      }
      const bioContainer = pane.querySelector('.team-profile-bio');
      if (bioContainer) {
        const paragraphs = bioContainer.querySelectorAll('p');
        paragraphs.forEach((para) => {
          const newP = document.createElement('p');
          newP.textContent = para.textContent.trim();
          textCol.appendChild(newP);
        });
      }

      profileCells.push([avatarCol, textCol]);
    }

    // Create a nested Team Profile block
    const nestedBlock = WebImporter.Blocks.createBlock(document, {
      name: 'Team Profile',
      cells: profileCells,
    });

    const tabContent = document.createElement('div');
    tabContent.appendChild(nestedBlock);

    cells.push([tabLabel, tabContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs',
    cells,
  });
  element.replaceWith(block);
}
