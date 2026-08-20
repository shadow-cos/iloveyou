/**
 * TheBeginning.js
 * ---------------------------------------------------------
 * Chapter One — "The Beginning 🌸"
 *
 * Renders entirely from /content/how-we-met.json. Nothing here
 * should ever need editing just to change words, timing, or the
 * photo — that all lives in the content file. This file only
 * decides *how* that content is structured and animated.
 */

import { createEl } from '../utils/dom.js';
import howWeMetData from '../../content/how-we-met.json';

function buildParagraphs(paragraphs = []) {
  const wrap = createEl('div', { className: 'beat__text' });
  paragraphs.forEach((text) => {
    wrap.appendChild(createEl('p', { html: text }));
  });
  return wrap;
}

function buildBeat(beat, index) {
  const el = createEl('article', {
    className: `beat beat--${index % 2 === 0 ? 'left' : 'right'}`,
    attrs: {
      'data-reveal': 'fade-up',
      'data-reveal-delay': '0.05'
    }
  });

  el.appendChild(createEl('p', { className: 'beat__label', text: beat.label }));
  el.appendChild(buildParagraphs(beat.paragraphs));

  return el;
}

export function renderTheBeginning(mountEl) {
  if (!mountEl) return;
  const data = howWeMetData || {};

  const section = createEl('section', {
    className: 'beginning-chapter',
    attrs: { 'aria-label': data.title || 'The Beginning' }
  });

  // ---- Header ----
  const header = createEl('header', { className: 'beginning-chapter__header' });
  header.appendChild(
    createEl('p', {
      className: 'beginning-chapter__eyebrow',
      text: data.eyebrow || 'Chapter One',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'beginning-chapter__title',
      html: `${data.title || 'The Beginning'} <span class="beginning-chapter__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  section.appendChild(header);

  // ---- Hero photo ----
  if (data.image?.src) {
    const figure = createEl('figure', {
      className: 'beginning-chapter__photo',
      attrs: { 'data-reveal': 'scale' }
    });
    const img = createEl('img', {
      attrs: {
        src: data.image.src,
        alt: data.image.alt || 'A photo from our story',
        loading: 'lazy'
      }
    });
    figure.appendChild(img);

    if (data.image.caption && !data.image.caption.startsWith('[')) {
      figure.appendChild(createEl('figcaption', { text: data.image.caption }));
    }
    section.appendChild(figure);
  }

  // ---- Story beats ----
  const beatsWrap = createEl('div', { className: 'beginning-chapter__beats' });
  (data.beats || []).forEach((beat, i) => beatsWrap.appendChild(buildBeat(beat, i)));
  section.appendChild(beatsWrap);

  // ---- Closing transition line ----
  if (data.closingLine) {
    const closing = createEl('p', {
      className: 'beginning-chapter__closing',
      text: data.closingLine,
      attrs: { 'data-reveal': 'fade' }
    });
    section.appendChild(closing);
  }

  mountEl.appendChild(section);
  return section;
}
