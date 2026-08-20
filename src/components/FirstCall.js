/**
 * FirstCall.js
 * ---------------------------------------------------------
 * Chapter Two — "The Conversations That Changed Everything 💬"
 *
 * Renders from /content/first-call.json. Mixes plain paragraph
 * beats with a few purpose-built moments (the "hmm" chat bubble,
 * the hour-by-hour time progression, the screenshot slots) that
 * this specific memory calls for — not a generic template.
 */

import { createEl } from '../utils/dom.js';
import firstCallData from '../../content/first-call.json';

function buildIntro(lines = []) {
  const wrap = createEl('div', { className: 'first-call__intro' });
  lines.forEach((line, i) => {
    wrap.appendChild(
      createEl('p', {
        className: i === lines.length - 1 ? 'first-call__intro-line first-call__intro-line--emphasis' : 'first-call__intro-line',
        text: line,
        attrs: { 'data-reveal': 'fade', 'data-reveal-delay': String(i * 0.25) }
      })
    );
  });
  return wrap;
}

function buildHmmMoment(message, note) {
  const wrap = createEl('div', { className: 'hmm-moment', attrs: { 'data-reveal': 'fade-up' } });

  const bubble = createEl('div', { className: 'chat-bubble chat-bubble--outgoing' });
  bubble.appendChild(createEl('p', { text: message }));
  wrap.appendChild(bubble);

  if (note) {
    wrap.appendChild(createEl('p', { className: 'hmm-moment__note', text: note }));
  }
  return wrap;
}

function buildParagraphBlock(paragraphs = [], className = 'story-block') {
  const wrap = createEl('div', { className, attrs: { 'data-reveal': 'fade-up' } });
  paragraphs.forEach((p) => wrap.appendChild(createEl('p', { text: p })));
  return wrap;
}

function buildTimeProgression(data) {
  if (!data) return null;
  const wrap = createEl('div', { className: 'time-progression' });

  const track = createEl('div', { className: 'time-progression__track' });
  (data.steps || []).forEach((step, i) => {
    const isLast = i === data.steps.length - 1;
    const node = createEl('div', {
      className: `time-progression__step${isLast ? ' time-progression__step--last' : ''}`,
      attrs: { 'data-reveal': 'scale', 'data-reveal-delay': String(i * 0.15) }
    });
    node.appendChild(createEl('span', { className: 'time-progression__dot' }));
    node.appendChild(createEl('span', { className: 'time-progression__label', text: step }));
    track.appendChild(node);
  });
  wrap.appendChild(track);

  if (data.highlight) {
    wrap.appendChild(
      createEl('p', {
        className: 'time-progression__highlight',
        text: data.highlight,
        attrs: { 'data-reveal': 'scale', 'data-reveal-delay': '0.8' }
      })
    );
  }

  if (data.afterText) {
    wrap.appendChild(
      createEl('p', {
        className: 'time-progression__after',
        text: data.afterText,
        attrs: { 'data-reveal': 'fade', 'data-reveal-delay': '1' }
      })
    );
  }

  return wrap;
}

function buildScreenshot(shot) {
  const figure = createEl('figure', {
    className: 'screenshot-card',
    attrs: { 'data-reveal': 'fade-up' }
  });

  if (shot.src) {
    figure.appendChild(
      createEl('img', {
        attrs: { src: shot.src, alt: shot.alt || shot.label || 'Screenshot', loading: 'lazy' }
      })
    );
  } else {
    const placeholder = createEl('div', { className: 'screenshot-card__placeholder' });
    placeholder.appendChild(createEl('span', { className: 'screenshot-card__icon', text: '📎' }));
    placeholder.appendChild(
      createEl('p', {
        className: 'screenshot-card__placeholder-text',
        text: `Add this screenshot to ${shot.expectedFile || 'assets/screenshots/first-call/'}`
      })
    );
    figure.appendChild(placeholder);
  }

  if (shot.label) {
    figure.appendChild(createEl('figcaption', { text: shot.label }));
  }

  return figure;
}

function buildScreenshotsRow(screenshots = []) {
  const row = createEl('div', { className: 'screenshots-row' });
  screenshots.forEach((s) => row.appendChild(buildScreenshot(s)));
  return row;
}

function buildClosing(lines = []) {
  const wrap = createEl('div', { className: 'first-call__closing' });
  lines.forEach((line, i) => {
    const isLast = i === lines.length - 1;
    wrap.appendChild(
      createEl('p', {
        className: isLast ? 'first-call__closing-line first-call__closing-line--final' : 'first-call__closing-line',
        text: line,
        attrs: { 'data-reveal': 'fade-up', 'data-reveal-delay': String(i * 0.15) }
      })
    );
  });
  return wrap;
}

export function renderFirstCall(mountEl) {
  if (!mountEl) return;
  const data = firstCallData || {};

  const section = createEl('section', {
    className: 'first-call-chapter',
    attrs: { 'aria-label': data.title || 'The Conversations That Changed Everything' }
  });

  // ---- Header ----
  const header = createEl('header', { className: 'first-call-chapter__header' });
  header.appendChild(
    createEl('p', {
      className: 'first-call-chapter__eyebrow',
      text: data.eyebrow || 'Chapter Two',
      attrs: { 'data-reveal': 'fade' }
    })
  );
  header.appendChild(
    createEl('h2', {
      className: 'first-call-chapter__title',
      html: `${data.title || 'The Conversations That Changed Everything'} <span class="first-call-chapter__title-emoji">${data.titleEmoji || ''}</span>`,
      attrs: { 'data-reveal': 'fade-up' }
    })
  );
  section.appendChild(header);

  const body = createEl('div', { className: 'first-call-chapter__body' });

  if (data.intro?.length) body.appendChild(buildIntro(data.intro));
  if (data.hmmMessage) body.appendChild(buildHmmMoment(data.hmmMessage, data.hmmNote));
  if (data.callOpening?.length) body.appendChild(buildParagraphBlock(data.callOpening));
  if (data.timeProgression) body.appendChild(buildTimeProgression(data.timeProgression));
  if (data.naturalness?.length) body.appendChild(buildParagraphBlock(data.naturalness));
  if (data.screenshots?.length) body.appendChild(buildScreenshotsRow(data.screenshots));
  if (data.studyMoment?.length) body.appendChild(buildParagraphBlock(data.studyMoment, 'story-block story-block--light'));
  if (data.meaning) body.appendChild(buildParagraphBlock([data.meaning]));
  if (data.fiveMinutesLine) {
    body.appendChild(
      createEl('p', {
        className: 'first-call-chapter__standalone',
        text: data.fiveMinutesLine,
        attrs: { 'data-reveal': 'fade' }
      })
    );
  }
  if (data.realization) {
    body.appendChild(
      createEl('p', {
        className: 'first-call-chapter__realization',
        text: data.realization,
        attrs: { 'data-reveal': 'fade-up' }
      })
    );
  }
  if (data.closing?.length) body.appendChild(buildClosing(data.closing));

  section.appendChild(body);
  mountEl.appendChild(section);
  return section;
}
