/**
 * Navigation.js
 * ---------------------------------------------------------
 * Phase 1: a minimal persistent nav bar — site mark + scroll
 * progress. It stays hidden during the landing sequence and
 * fades in once the reader has moved past it. Chapter links /
 * jump-to-chapter menu are added in a later phase once
 * chapters exist.
 */

import { qs } from '../utils/dom.js';
import { initNavVisibility, initScrollProgress } from '../utils/scrollAnimations.js';

export function initNavigation() {
  const navEl = qs('#site-nav');
  const landingEl = qs('#landing');
  const progressFill = qs('#nav-progress-fill');

  initNavVisibility(navEl, landingEl);
  initScrollProgress(progressFill);

  return navEl;
}
