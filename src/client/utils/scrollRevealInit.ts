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
        element.classList.add('revealed');
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
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
  }, 100);
};

let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

/** OPTIMIZED: Fallback: reveal any remaining elements after delay. Single check only. */
function setupScrollRevealFallback() {
  if (typeof window === 'undefined') return;
  if (fallbackTimer) clearTimeout(fallbackTimer);

  // OPTIMIZED: Single timeout instead of setInterval - much more efficient
  fallbackTimer = setTimeout(() => {
    document.querySelectorAll('.scroll-reveal-io:not(.revealed)').forEach((el) => {
      el.classList.add('revealed');
    });
    fallbackTimer = null;
  }, 2000);
}

export const initScrollRevealWithFallback = () => {
  if (fallbackTimer) clearTimeout(fallbackTimer);
  // OPTIMIZED: Removed fallbackCheckInterval - no longer used
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
