/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND cleanup.
 * Removes non-authorable site chrome from the WKND source pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove non-authorable site chrome (header nav, footer, skip link)
    // Must run before section splitting so nav/footer elements don't interfere with section selectors
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      '.footer',
      '.skip-link',
      'noscript',
      'link',
      'iframe',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Resolve all relative image URLs to absolute using the source page URL
    // Runs after block parsing so parser-created images are also resolved
    const sourceUrl = payload.params && payload.params.originalURL;
    if (sourceUrl) {
      element.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
          try {
            img.setAttribute('src', new URL(src, sourceUrl).href);
          } catch (e) {
            // skip malformed URLs
          }
        }
      });
    }
  }
}
