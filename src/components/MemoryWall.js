/**
 * MemoryWall.js
 * ---------------------------------------------------------
 * Chapter Five — "Our Favorite Memories 📸"
 *
 * Renders a scrapbook-style wall of Polaroids from the
 * data-driven array in /content/memories.json, plus a full
 * memory viewer modal with prev/next/close, keyboard nav,
 * and scroll-locking. Adding Memory 3, 4, 5... is just adding
 * an object to that JSON array — nothing here needs editing.
 */

import { createEl, prefersReducedMotion } from '../utils/dom.js';
import memoriesData from '../../content/memories.json';

// Deterministic pseudo-random tilt per card so it's stable across
// re-renders but still feels hand-placed rather than uniform.
function tiltFor(id) {
  const seed = Math.sin(id * 999) * 10000;
  const frac = seed - Math.floor(seed);
  return (frac - 0.5) * 8; // -4deg .. 4deg
}

function renderMultiline(container, text = '') {
  text.split('\n\n').forEach((para) => {
    if (para.trim()) container.appendChild(createEl('p', { text: para }));
  });
}

function buildPolaroid(memory, index, onOpen) {
  const rotate = tiltFor(memory.id ?? index);

  const wrap = createEl('div', {
    className: `polaroid polaroid--offset-${index % 3}`,
    attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': String((index % 4) * 0.08) }
  });
  wrap.style.setProperty('--polaroid-rotate', `${rotate.toFixed(1)}deg`);

  const btn = createEl('button', {
    className: 'polaroid__card',
    attrs: {
      type: 'button',
      'aria-label': `Open memory: ${memory.title}`
    }
  });

  btn.appendChild(createEl('span', { className: 'polaroid__tape', attrs: { 'aria-hidden': 'true' } }));

  if (memory.image) {
    btn.appendChild(
      createEl('img', {
        className: 'polaroid__img',
        attrs: {
          src: memory.image,
          alt: memory.alt || memory.title || 'A memory',
          loading: 'lazy',
          decoding: 'async'
        }
      })
    );
  } else {
    const placeholder = createEl('div', { className: 'polaroid__placeholder' });
    placeholder.appendChild(createEl('span', { text: '📷' }));
    placeholder.appendChild(createEl('p', { text: 'Photo coming soon' }));
    btn.appendChild(placeholder);
  }

  btn.appendChild(createEl('span', { className: 'polaroid__caption', text: memory.title }));
  btn.appendChild(createEl('span', { className: 'polaroid__heart-doodle', text: '♡', attrs: { 'aria-hidden': 'true' } }));

  btn.addEventListener('click', () => onOpen(index));
  wrap.appendChild(btn);
  return wrap;
}

function buildScatteredNotes(notes = []) {
  const wrap = createEl('div', { className: 'scattered-notes', attrs: { 'aria-hidden': 'true' } });
  notes.slice(0, 5).forEach((note, i) => {
    wrap.appendChild(createEl('span', { className: `scattered-note scattered-note--${i}`, text: note }));
  });
  return wrap;
}

/** Builds the (initially hidden) modal shell once; content is
 *  swapped in by showMemoryAt(). */
function buildModal(closeModal, navigate) {
  const overlay = createEl('div', {
    className: 'memory-modal-overlay',
    attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Memory viewer' }
  });

  const modal = createEl('div', { className: 'memory-modal' });

  const closeBtn = createEl('button', {
    className: 'memory-modal__close',
    attrs: { type: 'button', 'aria-label': 'Close memory viewer' },
    text: '✕'
  });
  closeBtn.addEventListener('click', closeModal);

  const imgWrap = createEl('div', { className: 'memory-modal__image-wrap' });
  const img = createEl('img', { className: 'memory-modal__image', attrs: { alt: '' } });
  imgWrap.appendChild(img);

  const prevBtn = createEl('button', {
    className: 'memory-modal__nav memory-modal__nav--prev',
    attrs: { type: 'button', 'aria-label': 'Previous memory' },
    text: '←'
  });
  prevBtn.addEventListener('click', () => navigate(-1));

  const nextBtn = createEl('button', {
    className: 'memory-modal__nav memory-modal__nav--next',
    attrs: { type: 'button', 'aria-label': 'Next memory' },
    text: '→'
  });
  nextBtn.addEventListener('click', () => navigate(1));

  const body = createEl('div', { className: 'memory-modal__body' });
  const dateEl = createEl('p', { className: 'memory-modal__date' });
  const titleEl = createEl('h3', { className: 'memory-modal__title' });
  const storyEl = createEl('div', { className: 'memory-modal__story' });
  const whyBox = createEl('div', { className: 'memory-modal__why' });
  const whyLabel = createEl('p', { className: 'memory-modal__why-label', text: 'Why this memory matters to me ❤️' });
  const whyText = createEl('p', { className: 'memory-modal__why-text' });
  whyBox.appendChild(whyLabel);
  whyBox.appendChild(whyText);

  body.appendChild(dateEl);
  body.appendChild(titleEl);
  body.appendChild(storyEl);
  body.appendChild(whyBox);

  modal.appendChild(closeBtn);
  modal.appendChild(imgWrap);
  modal.appendChild(prevBtn);
  modal.appendChild(nextBtn);
  modal.appendChild(body);
  overlay.appendChild(modal);

  return {
    overlay,
    refs: { img, dateEl, titleEl, storyEl, whyBox, whyText, prevBtn, nextBtn, closeBtn }
  };
}

export function renderMemoryWall(mountEl) {
  if (!mountEl) return;
  const data = memoriesData || {};
  const memories = data.memories || [];

  const section = createEl('section', {
    className: 'memory-wall-chapter',
    attrs: { 'aria-label': data.title || 'Our Favorite Memories' }
  });

  // ---- Header ----
  const header = createEl('header', { className: 'memory-wall-chapter__header' });
  header.appendChild(
    createEl('p', {
      className: 'memory-wall-chapter__eyebrow',
      text: data.eyebrow || 'Chapter Five',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'memory-wall-chapter__title',
      html: `${data.title || 'Our Favorite Memories'} <span class="memory-wall-chapter__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  if (data.subtitle) {
    header.appendChild(
      createEl('p', {
        className: 'memory-wall-chapter__subtitle',
        text: data.subtitle,
        attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': '0.1' }
      })
    );
  }
  section.appendChild(header);

  // ---- Wall ----
  const wallWrap = createEl('div', { className: 'memory-wall' });
  wallWrap.appendChild(buildScatteredNotes(data.scatteredNotes));

  const grid = createEl('div', { className: 'memory-wall__grid' });

  // ---- Modal state ----
  let currentIndex = 0;
  let lastFocusedEl = null;

  const showMemoryAt = (index) => {
    const memory = memories[index];
    if (!memory) return;
    currentIndex = index;

    refs.img.src = memory.image || '';
    refs.img.alt = memory.alt || memory.title || 'A memory';
    refs.img.style.display = memory.image ? '' : 'none';

    refs.titleEl.textContent = memory.title || '';

    if (memory.date && memory.date.trim()) {
      refs.dateEl.textContent = memory.date;
      refs.dateEl.style.display = '';
    } else {
      refs.dateEl.style.display = 'none';
    }

    refs.storyEl.innerHTML = '';
    renderMultiline(refs.storyEl, memory.story || '');

    if (memory.whyItMatters && memory.whyItMatters.trim()) {
      refs.whyText.textContent = memory.whyItMatters;
      refs.whyBox.style.display = '';
    } else {
      refs.whyBox.style.display = 'none';
    }

    refs.prevBtn.disabled = index === 0;
    refs.nextBtn.disabled = index === memories.length - 1;
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown);
    window.setTimeout(() => lastFocusedEl?.focus?.(), 50);
  };

  const navigate = (delta) => {
    const next = currentIndex + delta;
    if (next < 0 || next >= memories.length) return;
    showMemoryAt(next);
  };

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  const openModal = (index, triggerEl) => {
    lastFocusedEl = triggerEl || document.activeElement;
    showMemoryAt(index);
    overlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onKeydown);
    window.setTimeout(() => refs.closeBtn.focus(), prefersReducedMotion() ? 0 : 150);
  };

  const { overlay, refs } = buildModal(closeModal, navigate);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  memories.forEach((memory, i) => {
    const polaroid = buildPolaroid(memory, i, (idx) => {
      const triggerBtn = polaroid.querySelector('.polaroid__card');
      openModal(idx, triggerBtn);
    });
    grid.appendChild(polaroid);
  });

  wallWrap.appendChild(grid);
  section.appendChild(wallWrap);
  document.body.appendChild(overlay);

  // ---- Closing ----
  if (data.closing) {
    const closing = createEl('div', { className: 'memory-wall-chapter__closing', attrs: { 'data-reveal': 'fade-up' } });
    closing.appendChild(createEl('p', { className: 'memory-wall-chapter__closing-title', text: data.closing.title || '' }));
    const closingText = createEl('div', { className: 'memory-wall-chapter__closing-text' });
    renderMultiline(closingText, data.closing.text || '');
    closing.appendChild(closingText);
    section.appendChild(closing);
  }

  mountEl.appendChild(section);
  return section;
}
