/**
 * SecretWorld.js
 * ---------------------------------------------------------
 * Chapter Four — "Things Only We Understand 🗝️"
 *
 * Each memory starts locked. Clicking unlocks it with a small
 * shimmer + heart-burst and reveals the text. Once every memory
 * is unlocked, the finale section (hidden until then) reveals
 * itself automatically. Unlock state lives only in memory for
 * this page view — it isn't persisted, so the surprise resets
 * on reload, which is the right default for a first viewing.
 */

import { createEl, prefersReducedMotion } from '../utils/dom.js';
import secretWorldData from '../../content/secret-world.json';

function renderMultiline(container, text = '') {
  text.split('\n\n').forEach((para) => {
    if (para.trim()) container.appendChild(createEl('p', { text: para }));
  });
}

function spawnHeartBurst(originEl) {
  if (prefersReducedMotion()) return;
  const rect = originEl.getBoundingClientRect();
  const layer = document.body;

  for (let i = 0; i < 6; i++) {
    const heart = createEl('span', { className: 'secret-heart-particle', text: '❤' });
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 40;
    const y = rect.top + rect.height / 2;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 60}px`);
    heart.style.animationDelay = `${i * 0.04}s`;
    layer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }
}

function buildMemoryCard(memory, onUnlock) {
  const card = createEl('div', {
    className: 'secret-card',
    attrs: { 'data-reveal': 'fade-up' }
  });

  const btn = createEl('button', {
    className: 'secret-card__trigger',
    attrs: {
      type: 'button',
      'aria-pressed': 'false',
      'aria-label': `Unlock the memory: ${memory.lockedLabel}`
    }
  });

  const lockIcon = createEl('span', { className: 'secret-card__icon', text: '🔐' });
  const label = createEl('span', { className: 'secret-card__label', text: memory.lockedLabel });
  const hint = createEl('span', { className: 'secret-card__hint', text: 'tap to unlock' });

  btn.appendChild(lockIcon);
  btn.appendChild(label);
  btn.appendChild(hint);

  const revealBox = createEl('div', { className: 'secret-card__reveal' });
  renderMultiline(revealBox, memory.reveal || '');

  card.appendChild(btn);
  card.appendChild(revealBox);

  let unlocked = false;
  btn.addEventListener('click', () => {
    if (unlocked) return;
    unlocked = true;

    card.classList.add('is-unlocking');
    lockIcon.textContent = '🔓';
    btn.setAttribute('aria-pressed', 'true');
    btn.disabled = true;
    spawnHeartBurst(btn);

    window.setTimeout(() => {
      card.classList.add('is-unlocked');
      onUnlock?.();
    }, 450);
  });

  return card;
}

function buildFinale(finale) {
  const section = createEl('div', { className: 'secret-finale', attrs: { 'aria-live': 'polite' } });
  const inner = createEl('div', { className: 'secret-finale__inner' });

  inner.appendChild(
    createEl('p', {
      className: 'secret-finale__title',
      html: `<span class="secret-finale__title-emoji">${finale.titleEmoji || '🔓'}</span> ${finale.title || 'Our Secret World'}`
    })
  );

  const textWrap = createEl('div', { className: 'secret-finale__text' });
  renderMultiline(textWrap, finale.text || '');
  inner.appendChild(textWrap);

  section.appendChild(inner);
  return section;
}

export function renderSecretWorld(mountEl) {
  if (!mountEl) return;
  const data = secretWorldData || {};

  const section = createEl('section', {
    className: 'secret-world-chapter',
    attrs: { 'aria-label': data.title || 'Things Only We Understand' }
  });

  // ---- Header ----
  const header = createEl('header', { className: 'secret-world-chapter__header' });
  header.appendChild(
    createEl('p', {
      className: 'secret-world-chapter__eyebrow',
      text: data.eyebrow || 'Chapter Four',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'secret-world-chapter__title',
      html: `${data.title || 'Things Only We Understand'} <span class="secret-world-chapter__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  if (data.intro) {
    header.appendChild(
      createEl('p', {
        className: 'secret-world-chapter__intro',
        text: data.intro,
        attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': '0.1' }
      })
    );
  }
  section.appendChild(header);

  // ---- Cards ----
  const grid = createEl('div', { className: 'secret-card-grid' });
  const total = (data.memories || []).length;
  let unlockedCount = 0;

  const finaleEl = buildFinale(data.finale || {});

  (data.memories || []).forEach((memory) => {
    const card = buildMemoryCard(memory, () => {
      unlockedCount += 1;
      if (unlockedCount >= total) {
        window.setTimeout(() => {
          finaleEl.classList.add('is-revealed');
          finaleEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        }, 500);
      }
    });
    grid.appendChild(card);
  });

  section.appendChild(grid);
  section.appendChild(finaleEl);

  mountEl.appendChild(section);
  return section;
}
