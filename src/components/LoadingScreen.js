/**
 * LoadingScreen.js
 * ---------------------------------------------------------
 * Simple controller for the full-screen loader that covers
 * the initial paint/font/asset settle time. Hides itself once
 * the window has loaded, with a minimum dwell time so it never
 * flashes on fast connections.
 */

import { wait } from '../utils/dom.js';

const MIN_DISPLAY_MS = 900;

export async function initLoadingScreen(loadingEl) {
  if (!loadingEl) return;

  const start = performance.now();

  await new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  const elapsed = performance.now() - start;
  if (elapsed < MIN_DISPLAY_MS) {
    await wait(MIN_DISPLAY_MS - elapsed);
  }

  loadingEl.classList.add('is-hidden');
  // Remove from layout after the fade completes so it can never
  // block clicks if something goes wrong with the transition.
  await wait(1050);
  loadingEl.remove();
}
