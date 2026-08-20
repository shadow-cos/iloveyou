/**
 * dom.js — tiny helpers to keep components readable.
 */

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export function createEl(tag, { className, text, html, attrs } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (html !== undefined) el.innerHTML = html;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) el.setAttribute(key, val);
  }
  return el;
}

/** Waits ms, resolving after — used for the scripted timing of
 *  the landing sequence rather than nesting setTimeouts. */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
