/**
 * FloatingEmbers.js
 * ---------------------------------------------------------
 * Renders a sparse field of slow-drifting warm light motes —
 * the site's signature ambient motif (candlelight, not confetti
 * hearts). Reused on every section via #ember-field in index.html.
 */

import { prefersReducedMotion } from '../utils/dom.js';

export function initFloatingEmbers(containerEl, { count = 18 } = {}) {
  if (!containerEl || prefersReducedMotion()) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const ember = document.createElement('span');
    ember.className = 'ember';

    const size = 2 + Math.random() * 4; // 2–6px
    const left = Math.random() * 100; // vw
    const duration = 14 + Math.random() * 12; // 14–26s
    const delay = Math.random() * -duration; // negative = already in-flight
    const drift = (Math.random() - 0.5) * 120; // px sideways drift
    const opacity = 0.25 + Math.random() * 0.35;

    ember.style.left = `${left}%`;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.animationDuration = `${duration}s`;
    ember.style.animationDelay = `${delay}s`;
    ember.style.setProperty('--ember-drift', `${drift}px`);
    ember.style.setProperty('--ember-opacity', opacity.toFixed(2));

    fragment.appendChild(ember);
  }

  containerEl.appendChild(fragment);
}
