/**
 * scrollAnimations.js
 * ---------------------------------------------------------
 * The site's reusable animation system. Every future chapter
 * component should lean on these helpers instead of writing
 * bespoke GSAP timelines, so motion stays consistent and
 * cheap to add to.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './dom.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers scroll-triggered reveal animations for every
 * element carrying `[data-reveal]` inside `scope`. Call this
 * again after a chapter is injected into the DOM.
 *
 * Optional per-element tuning via data attributes:
 *   data-reveal="fade-up" | "fade" | "scale"
 *   data-reveal-delay="0.15"
 */
export function initScrollReveals(scope = document) {
  if (prefersReducedMotion()) return;

  const els = scope.querySelectorAll('[data-reveal]');

  els.forEach((el) => {
    const type = el.dataset.reveal || 'fade-up';
    const delay = parseFloat(el.dataset.revealDelay || '0');

    const from = { opacity: 0 };
    if (type === 'fade-up') from.y = 32;
    if (type === 'scale') from.scale = 0.94;

    gsap.set(el, from);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          delay,
          ease: 'power3.out'
        });
      }
    });
  });
}

/**
 * Drives the thin progress bar in the site nav based on total
 * scroll position. Call once after the DOM is ready.
 */
export function initScrollProgress(fillEl) {
  if (!fillEl) return;

  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate: (self) => {
      fillEl.style.width = `${self.progress * 100}%`;
    }
  });
}

/**
 * Shows/hides the persistent nav once the reader scrolls past
 * the landing section.
 */
export function initNavVisibility(navEl, landingEl) {
  if (!navEl || !landingEl) return;

  ScrollTrigger.create({
    trigger: landingEl,
    start: 'bottom top+=120',
    onEnter: () => navEl.classList.add('is-visible'),
    onLeaveBack: () => navEl.classList.remove('is-visible')
  });
}

/** Recalculates trigger positions — call after injecting new
 *  chapter content or loading images that change page height. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
