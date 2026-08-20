/**
 * UnwrittenChapters.js
 * ---------------------------------------------------------
 * Chapter Six — "The Unwritten Chapters 🔮"
 *
 * A small storybook of hopeful, unwritten future pages, built
 * from /content/unwritten-chapters.json. Each page starts
 * "unwritten"; clicking turns it over and the dream fades in
 * paragraph by paragraph, as if being written. Once every page
 * in the array is opened, a final page ("Whatever Comes Next")
 * appears — it isn't in the DOM at all until then.
 */

import { createEl, prefersReducedMotion } from '../utils/dom.js';
import unwrittenData from '../../content/unwritten-chapters.json';

function renderMultilineTyped(container, text = '') {
  const paragraphs = text.split('\n\n').filter((p) => p.trim());
  paragraphs.forEach((para, i) => {
    container.appendChild(
      createEl('p', {
        text: para,
        className: 'story-page__para',
        attrs: { style: `animation-delay: ${(i * 0.35).toFixed(2)}s` }
      })
    );
  });
}

function buildFloatingBookAtmosphere() {
  const wrap = createEl('div', { className: 'book-atmosphere', attrs: { 'aria-hidden': 'true' } });

  const book = createEl('div', { className: 'book-illustration' });
  book.appendChild(createEl('div', { className: 'book-illustration__page book-illustration__page--left' }));
  book.appendChild(createEl('div', { className: 'book-illustration__page book-illustration__page--right' }));
  book.appendChild(createEl('div', { className: 'book-illustration__spine' }));
  book.appendChild(createEl('div', { className: 'book-illustration__bookmark' }));
  wrap.appendChild(book);

  if (!prefersReducedMotion()) {
    const symbols = ['✦', '❤', '✧', '☆'];
    for (let i = 0; i < 8; i++) {
      const p = createEl('span', {
        className: 'book-particle',
        text: symbols[i % symbols.length]
      });
      p.style.left = `${8 + Math.random() * 84}%`;
      p.style.animationDuration = `${6 + Math.random() * 5}s`;
      p.style.animationDelay = `${-Math.random() * 8}s`;
      wrap.appendChild(p);
    }
  }

  return wrap;
}

function buildPage(chapterData, onOpened) {
  const page = createEl('article', {
    className: 'story-page',
    attrs: { 'data-reveal': 'fade-up' }
  });

  const btn = createEl('button', {
    className: 'story-page__trigger',
    attrs: { type: 'button', 'aria-pressed': 'false', 'aria-label': `Open the chapter: ${chapterData.title}` }
  });

  btn.appendChild(createEl('span', { className: 'story-page__icon', text: chapterData.icon || '🔮' }));
  btn.appendChild(createEl('p', { className: 'story-page__title', text: chapterData.title }));
  btn.appendChild(
    createEl('p', {
      className: 'story-page__status',
      text: unwrittenData.handwrittenLine || 'Still waiting to be written…'
    })
  );

  const content = createEl('div', { className: 'story-page__content' });
  renderMultilineTyped(content, chapterData.dream || '');
  if (chapterData.closingLine) {
    content.appendChild(createEl('p', { className: 'story-page__closing-line', text: chapterData.closingLine }));
  }

  page.appendChild(btn);
  page.appendChild(content);

  let opened = false;
  btn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    page.classList.add('is-turning');
    btn.setAttribute('aria-pressed', 'true');

    window.setTimeout(() => {
      page.classList.add('is-open');
      btn.querySelector('.story-page__status').textContent = 'Chapter written together';
      btn.querySelector('.story-page__icon').textContent = '❤️';
      onOpened?.();
    }, prefersReducedMotion() ? 0 : 420);
  });

  return page;
}

function buildFinalPage(finalData) {
  const page = createEl('article', { className: 'story-page story-page--final' });

  const btn = createEl('button', {
    className: 'story-page__trigger',
    attrs: { type: 'button', 'aria-pressed': 'false', 'aria-label': `Open the final page: ${finalData.title}` }
  });
  btn.appendChild(createEl('span', { className: 'story-page__icon', text: '📖' }));
  btn.appendChild(createEl('p', { className: 'story-page__title', text: finalData.title }));
  btn.appendChild(createEl('p', { className: 'story-page__status story-page__status--blank', text: finalData.blankNote }));

  const content = createEl('div', { className: 'story-page__content' });
  renderMultilineTyped(content, finalData.dream || '');
  if (finalData.toBeContinued) {
    content.appendChild(
      createEl('p', {
        className: 'story-page__to-be-continued',
        html: `${finalData.toBeContinued}<span class="blinking-cursor" aria-hidden="true">|</span>`
      })
    );
  }

  page.appendChild(btn);
  page.appendChild(content);

  let opened = false;
  btn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    page.classList.add('is-turning');
    btn.setAttribute('aria-pressed', 'true');
    window.setTimeout(() => page.classList.add('is-open'), prefersReducedMotion() ? 0 : 420);
  });

  return page;
}

export function renderUnwrittenChapters(mountEl) {
  if (!mountEl) return;
  const data = unwrittenData || {};

  const section = createEl('section', {
    className: 'unwritten-chapters',
    attrs: { 'aria-label': data.title || 'The Unwritten Chapters' }
  });

  // ---- Header + book atmosphere ----
  const header = createEl('header', { className: 'unwritten-chapters__header' });
  header.appendChild(
    createEl('p', {
      className: 'unwritten-chapters__eyebrow',
      text: data.eyebrow || 'Chapter Six',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'unwritten-chapters__title',
      html: `${data.title || 'The Unwritten Chapters'} <span class="unwritten-chapters__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  if (data.subtitle) {
    header.appendChild(
      createEl('p', {
        className: 'unwritten-chapters__subtitle',
        text: data.subtitle,
        attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': '0.1' }
      })
    );
  }
  section.appendChild(header);
  section.appendChild(buildFloatingBookAtmosphere());
  if (data.handwrittenLine) {
    section.appendChild(
      createEl('p', {
        className: 'unwritten-chapters__handwritten-line',
        text: data.handwrittenLine,
        attrs: { 'data-reveal': 'fade' }
      })
    );
  }

  // ---- Pages ----
  const pagesWrap = createEl('div', { className: 'story-pages' });
  const total = (data.chapters || []).length;
  let openedCount = 0;

  const finalSlot = createEl('div', { className: 'story-page-final-slot' });

  (data.chapters || []).forEach((chapterData) => {
    const page = buildPage(chapterData, () => {
      openedCount += 1;
      if (openedCount >= total && data.finalChapter) {
        window.setTimeout(() => {
          const finalPage = buildFinalPage(data.finalChapter);
          finalSlot.appendChild(finalPage);
          finalSlot.classList.add('is-revealed');
          finalPage.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        }, 500);
      }
    });
    pagesWrap.appendChild(page);
  });

  section.appendChild(pagesWrap);
  section.appendChild(finalSlot);

  // ---- Closing ----
  if (data.closing) {
    const closing = createEl('div', { className: 'unwritten-chapters__closing', attrs: { 'data-reveal': 'fade' } });
    if (data.closing.line1) closing.appendChild(createEl('p', { text: data.closing.line1 }));
    if (data.closing.line2) closing.appendChild(createEl('p', { text: data.closing.line2 }));
    if (data.closing.line3) {
      closing.appendChild(createEl('p', { className: 'unwritten-chapters__closing-final', text: data.closing.line3 }));
    }
    section.appendChild(closing);
  }

  mountEl.appendChild(section);
  return section;
}
