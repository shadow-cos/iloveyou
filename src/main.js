/**
 * main.js
 * ---------------------------------------------------------
 * App entry point. Wires together the loading screen, ambient
 * ember field, landing sequence, navigation, and the reusable
 * scroll-reveal system. Chapter components register themselves
 * here in later phases.
 */

import { qs } from './utils/dom.js';
import { initLoadingScreen } from './components/LoadingScreen.js';
import { initFloatingEmbers } from './components/FloatingEmbers.js';
import { initLanding } from './components/Landing.js';
import { initNavigation } from './components/Navigation.js';
import { renderTheBeginning } from './components/TheBeginning.js';
import { renderFirstCall } from './components/FirstCall.js';
import { renderLittleThings } from './components/LittleThings.js';
import { renderSecretWorld } from './components/SecretWorld.js';
import { renderMemoryWall } from './components/MemoryWall.js';
import { renderUnwrittenChapters } from './components/UnwrittenChapters.js';
import { initScrollReveals, refreshScrollTriggers } from './utils/scrollAnimations.js';

async function bootstrap() {
  // Ambient atmosphere runs immediately, behind the loading screen.
  initFloatingEmbers(qs('#ember-field'), { count: 16 });

  // Chapters are built into the DOM up front (content is static),
  // but their animations only trigger once the reader scrolls to
  // them — handled by initScrollReveals below.
  renderTheBeginning(qs('#chapter-beginning-root'));
  renderFirstCall(qs('#chapter-first-call-root'));
  renderLittleThings(qs('#chapter-little-things-root'));
  renderSecretWorld(qs('#chapter-secret-world-root'));
  renderMemoryWall(qs('#chapter-memory-wall-root'));
  renderUnwrittenChapters(qs('#chapter-unwritten-root'));

  // Loading screen resolves once window assets + fonts have settled.
  await initLoadingScreen(qs('#loading-screen'));

  // Opening cinematic sequence.
  await initLanding({
    onStart: () => {
      initScrollReveals(qs('#chapters-root'));
      refreshScrollTriggers();
    }
  });

  // Persistent nav (progress bar, chapter mark) — hidden until the
  // reader scrolls past the landing section.
  initNavigation();
}

bootstrap();
