/**
 * LittleThings.js
 * ---------------------------------------------------------
 * Chapter Three — "The Little Things ❤️"
 *
 * Renders a scattered field of gently floating cards, one per
 * small-moment category in /content/little-things.json. Clicking
 * (or pressing Enter/Space) flips a card to reveal the real
 * memory/message behind it. Floating motion and scroll-reveal
 * are handled on separate wrapper elements so their transforms
 * never fight each other.
 */

import { createEl } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/dom.js';
import littleThingsData from '../../content/little-things.json';

function isPlaceholder(text) {
  return typeof text === 'string' && text.trim().startsWith('[');
}

function buildCard(card, index) {
  const reduced = prefersReducedMotion();

  const wrap = createEl('div', {
    className: 'memory-card-wrap',
    attrs: {
      'data-reveal': 'scale',
      'data-reveal-delay': String((index % 4) * 0.08)
    }
  });

  const btn = createEl('button', {
    className: 'memory-card',
    attrs: {
      type: 'button',
      'aria-pressed': 'false',
      'aria-label': `${card.title} — tap to reveal the memory`
    }
  });

  if (!reduced) {
    const duration = 5 + Math.random() * 3; // 5–8s
    const delay = -Math.random() * duration; // desync the bob
    const drift = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
    btn.style.animation = `card-float ${duration.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`;
    btn.style.setProperty('--card-tilt', `${drift.toFixed(2)}deg`);
  }

  const inner = createEl('div', { className: 'memory-card__inner' });

  // ---- Front ----
  const front = createEl('div', { className: 'memory-card__face memory-card__face--front' });
  front.appendChild(createEl('span', { className: 'memory-card__emoji', text: card.emoji || '💛' }));
  front.appendChild(createEl('p', { className: 'memory-card__title', text: card.title }));
  front.appendChild(createEl('span', { className: 'memory-card__hint', text: 'tap to reveal' }));
  inner.appendChild(front);

  // ---- Back ----
  const back = createEl('div', { className: 'memory-card__face memory-card__face--back' });
  const revealIsPlaceholder = isPlaceholder(card.reveal);
  back.appendChild(
    createEl('p', {
      className: `memory-card__reveal-text${revealIsPlaceholder ? ' memory-card__reveal-text--placeholder' : ''}`,
      text: card.reveal || '[a memory will go here]'
    })
  );
  inner.appendChild(back);

  btn.appendChild(inner);

  btn.addEventListener('click', () => {
    const flipped = btn.classList.toggle('is-flipped');
    btn.setAttribute('aria-pressed', String(flipped));
  });

  wrap.appendChild(btn);
  return wrap;
}

export function renderLittleThings(mountEl) {
  if (!mountEl) return;
  const data = littleThingsData || {};

  const section = createEl('section', {
    className: 'little-things-chapter',
    attrs: { 'aria-label': data.title || 'The Little Things' }
  });

  // ---- Header ----
  const header = createEl('header', { className: 'little-things-chapter__header' });
  header.appendChild(
    createEl('p', {
      className: 'little-things-chapter__eyebrow',
      text: data.eyebrow || 'Chapter Three',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'little-things-chapter__title',
      html: `${data.title || 'The Little Things'} <span class="little-things-chapter__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  if (data.intro) {
    header.appendChild(
      createEl('p', {
        className: 'little-things-chapter__intro',
        text: data.intro,
        attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': '0.1' }
      })
    );
  }
  section.appendChild(header);

  // ---- Card field ----
  const field = createEl('div', { className: 'memory-card-field' });
  (data.cards || []).forEach((card, i) => field.appendChild(buildCard(card, i)));
  section.appendChild(field);

  // ---- Closing line ----
  if (data.closingLine) {
    section.appendChild(
      createEl('p', {
        className: 'little-things-chapter__closing',
        text: data.closingLine,
        attrs: { 'data-reveal': 'fade' }
      })
    );
  }

  mountEl.appendChild(section);
  return section;
}
