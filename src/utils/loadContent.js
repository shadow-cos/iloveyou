/**
 * loadContent.js
 * ---------------------------------------------------------
 * Small helper for reading the JSON files in /content safely.
 * Nothing in the app should ever crash because a field is
 * missing — it should fall back to a gentle placeholder.
 *
 * Usage:
 *   import { loadJSON, withPlaceholder } from './utils/loadContent.js';
 *   const data = await loadJSON('/content/landing.json');
 *   const name = withPlaceholder(data.name, '[HER NAME]');
 */

export async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[content] Could not load ${path}. Using empty object.`, err);
    return {};
  }
}

/**
 * Returns `value` if it's a non-empty string, otherwise a
 * visible placeholder so unfinished chapters never look
 * broken — they look "in progress" on purpose.
 */
export function withPlaceholder(value, placeholder = '[ADD YOUR OWN WORDS HERE]') {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return placeholder;
}

/**
 * True if a field is missing/empty — useful for conditionally
 * skipping optional media (photos, audio) instead of rendering
 * a broken <img>/<audio> tag.
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
