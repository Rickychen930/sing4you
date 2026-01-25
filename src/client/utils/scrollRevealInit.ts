/**
 * Initialize scroll reveal for all elements with class 'scroll-reveal-io'
 * Uses Intersection Observer for better performance.
 * Route changes are handled by ScrollRevealHandler in App (pathname) + popstate (back/forward).
 */
let initScrollRevealTimeout: ReturnType<typeof setTimeout> | null = null;
let isInitializing = false;

export const initScrollReveal = () => {
  if (initScrollRevealTimeout) {
    clearTimeout(initScrollRevealTimeout);
  }

  initScrollRevealTimeout = setTimeout(() => {
    if (isInitializing) return;
    isInitializing = true;

    if (typeof window === 'undefined') {
      isInitializing = false;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal-io').forEach((el) => el.classList.add('revealed'));
      isInitializing = false;
      return;
    }

    const elements = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
    if (elements.length === 0) {
      isInitializing = false;
      return;
    }

    const viewportHeight = window.innerHeight ?? document.documentElement.clientHeight;

    const checkInitialVisibility = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < viewportHeight + 500 && rect.bottom > -200;
      if (isVisible) {
        requestAnimationFrame(() => {
          element.classList.add('revealed');
          if (element instanceof HTMLElement) {
            setTimeout(() => { element.style.willChange = 'auto'; }, 600);
          }
        });
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          requestAnimationFrame(() => {
            el.classList.add('revealed');
            if (el instanceof HTMLElement) {
              setTimeout(() => { el.style.willChange = 'auto'; }, 600);
            }
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -80px 0px' }
    );

    const hiddenElements: Element[] = [];
    elements.forEach((el) => {
      if (!checkInitialVisibility(el)) hiddenElements.push(el);
    });
    hiddenElements.forEach((el) => observer.observe(el));

    isInitializing = false;
  }, 50);
};

let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
let fallbackCheckInterval: ReturnType<typeof setInterval> | null = null;

/** Fallback: reveal any remaining elements after delay. Call on init + route change. */
function setupScrollRevealFallback() {
  if (typeof window === 'undefined') return;
  if (fallbackTimer) clearTimeout(fallbackTimer);
  if (fallbackCheckInterval) clearInterval(fallbackCheckInterval);

  fallbackTimer = setTimeout(() => {
    document.querySelectorAll('.scroll-reveal-io:not(.revealed)').forEach((el) => {
      el.classList.add('revealed');
    });
    fallbackTimer = null;
  }, 1500);

  let ticks = 0;
  fallbackCheckInterval = setInterval(() => {
    ticks++;
    const unrevealed = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
    if (unrevealed.length === 0 || ticks >= 30) {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (fallbackCheckInterval) clearInterval(fallbackCheckInterval);
      fallbackTimer = null;
      fallbackCheckInterval = null;
    }
  }, 500);
}

export const initScrollRevealWithFallback = () => {
  if (fallbackTimer) clearTimeout(fallbackTimer);
  if (fallbackCheckInterval) clearInterval(fallbackCheckInterval);
  initScrollReveal();
  setupScrollRevealFallback();
};

// Initial load only – DOM ready
if (typeof window !== 'undefined') {
  const run = () => {
    setTimeout(() => initScrollRevealWithFallback(), 200);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  let lastPath = location.pathname;
  window.addEventListener(
    'popstate',
    () => {
      if (location.pathname === lastPath) return;
      lastPath = location.pathname;
      setTimeout(() => initScrollRevealWithFallback(), 200);
    },
    { passive: true }
  );
}
