/**
 * Landing.js
 * ---------------------------------------------------------
 * Drives the opening cinematic sequence:
 *   line 1 -> line 2 -> line 3 -> signature line -> button + hint
 *
 * The name shown in the signature line, and the line timings,
 * come from /content/landing.json so they can be edited without
 * touching code. Missing/empty values fall back to sane defaults
 * defined right in the markup (index.html).
 */

import { qs, qsa, wait, prefersReducedMotion } from '../utils/dom.js';
import { withPlaceholder } from '../utils/loadContent.js';
// Content is imported directly (Vite bundles JSON natively). Edit the
// values in /content/landing.json — never edit this file to change text.
import landingData from '../../content/landing.json';

const DEFAULT_HOLD_MS = [2600, 3000, 3400]; // how long lines 1–3 stay on screen

export async function initLanding({ onStart } = {}) {
  const landingEl = qs('#landing');
  const lines = qsa('.landing__line', landingEl);
  const nameEl = qs('#landing-name');
  const startBtn = qs('#start-story-btn');
  const hintEl = qs('#landing-hint');

  // ---- Read editable content (name + optional custom timing) ----
  const data = landingData || {};
  if (data.name) nameEl.textContent = withPlaceholder(data.name, nameEl.textContent);

  const hold = Array.isArray(data.lineHoldMs) && data.lineHoldMs.length === 3
    ? data.lineHoldMs
    : DEFAULT_HOLD_MS;

  const reduced = prefersReducedMotion();

  // ---- Sequence the lines ----
  if (reduced) {
    // Show everything at once, no timed choreography.
    lines.forEach((line) => line.classList.add('is-active'));
  } else {
    await wait(500);
    for (let i = 0; i < lines.length; i++) {
      lines[i].classList.add('is-active');
      const isLast = i === lines.length - 1;
      if (!isLast) {
        await wait(hold[i] ?? 2800);
        lines[i].classList.remove('is-active');
        lines[i].classList.add('is-past');
      }
    }
  }

  // ---- Reveal the call to action ----
  await wait(reduced ? 200 : 600);
  startBtn.classList.add('is-visible');
  hintEl.classList.add('is-visible');

  // ---- Wire up dismissal ----
  const chaptersRoot = qs('#chapters-root');

  const dismiss = () => {
    if (landingEl.classList.contains('is-leaving')) return;
    landingEl.classList.add('is-leaving');
    landingEl.setAttribute('aria-hidden', 'true');
    startBtn.setAttribute('tabindex', '-1');
    if (typeof onStart === 'function') onStart();

    // Carry the reader down to what comes next rather than leaving
    // them staring at a fading, now-empty screen.
    window.setTimeout(() => {
      chaptersRoot?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start'
      });
    }, reduced ? 0 : 450);
  };

  startBtn.addEventListener('click', dismiss, { once: true });

  // Scrolling past the landing section also counts as "starting".
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY > 0 && startBtn.classList.contains('is-visible')) dismiss();
    },
    { once: true, passive: true }
  );
}
