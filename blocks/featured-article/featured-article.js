export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((col) => {
    const pic = col.querySelector('picture');
    if (pic) {
      const picWrapper = pic.closest('div');
      if (picWrapper && picWrapper.children.length === 1) {
        picWrapper.classList.add('featured-article-img-col');
      }
    } else {
      const img = col.querySelector(':scope > p > img');
      if (img && col.children.length === 1) {
        col.classList.add('featured-article-img-col');
      }
    }
  });
}
