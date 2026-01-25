/**
 * Initialize scroll reveal for all elements with class 'scroll-reveal-io'
 * Uses Intersection Observer for better performance
 */
let initScrollRevealTimeout: NodeJS.Timeout | null = null;
let isInitializing = false;

export const initScrollReveal = () => {
  // Debounce multiple calls
  if (initScrollRevealTimeout) {
    clearTimeout(initScrollRevealTimeout);
  }
  
  if (isInitializing) return;
  
  initScrollRevealTimeout = setTimeout(() => {
    isInitializing = true;
  // Skip if already initialized or if user prefers reduced motion
  if (typeof window === 'undefined') {
    return;
  }

  // If user prefers reduced motion, immediately reveal all elements
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const elements = document.querySelectorAll('.scroll-reveal-io');
    elements.forEach((element) => {
      element.classList.add('revealed');
    });
    return;
  }

  const elements = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
  
  if (elements.length === 0) return;

  // Check elemen yang sudah di viewport saat init
  const checkInitialVisibility = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // Check jika elemen sudah visible atau akan segera visible (lebih generous)
    const isVisible = rect.top < viewportHeight + 500 && rect.bottom > -200;
    if (isVisible) {
      // Langsung reveal untuk elemen yang sudah visible dengan small delay untuk smooth animation
      setTimeout(() => {
        element.classList.add('revealed');
      }, 50);
      return true;
    }
    return false;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after revealed for performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01, // Very low threshold to trigger faster
      rootMargin: '0px 0px -50px 0px', // Small negative margin to trigger slightly earlier
    }
  );

  // First pass: Check dan reveal elemen yang sudah visible
  const visibleElements: Element[] = [];
  const hiddenElements: Element[] = [];
  
  elements.forEach((element) => {
    if (checkInitialVisibility(element)) {
      visibleElements.push(element);
    } else {
      hiddenElements.push(element);
    }
  });

  // Observe hanya elemen yang belum visible
  hiddenElements.forEach((element) => {
    observer.observe(element);
  });

  isInitializing = false;
  
  return () => {
    elements.forEach((element) => {
      observer.unobserve(element);
    });
  };
  }, 50); // Debounce 50ms
};

// Auto-initialize saat DOM ready
if (typeof window !== 'undefined') {
  let fallbackTimer: NodeJS.Timeout | null = null;
  let checkInterval: NodeJS.Timeout | null = null;

  const setupFallback = () => {
    // Clear existing timers
    if (fallbackTimer) clearTimeout(fallbackTimer);
    if (checkInterval) clearInterval(checkInterval);

    // Fallback: Reveal semua elemen setelah 1.5 detik jika belum ter-reveal
    fallbackTimer = setTimeout(() => {
      const unrevealed = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
      if (unrevealed.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[ScrollReveal] Fallback: Revealing ${unrevealed.length} elements`);
        }
        unrevealed.forEach((element) => {
          element.classList.add('revealed');
        });
      }
    }, 1500);
    
    // Cleanup fallback timer if all elements are revealed faster
    checkInterval = setInterval(() => {
      const unrevealed = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
      if (unrevealed.length === 0) {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        if (checkInterval) clearInterval(checkInterval);
      }
    }, 500);
  };

  const initialize = () => {
    // Initial load - single call with delay to ensure DOM is ready
    setTimeout(() => {
      initScrollReveal();
    }, 200);
    
    setupFallback();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Re-initialize after route changes (for SPA) - using MutationObserver or popstate
  let lastPath = window.location.pathname;
  
  // Listen to popstate for browser navigation
  window.addEventListener('popstate', () => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (checkInterval) clearInterval(checkInterval);
      
      setTimeout(() => {
        initScrollReveal();
        setTimeout(() => {
          initScrollReveal();
        }, 200);
        setupFallback();
      }, 200);
    }
  }, { passive: true });

  // Use MutationObserver to detect DOM changes - debounced
  let mutationTimeout: NodeJS.Timeout | null = null;
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (checkInterval) clearInterval(checkInterval);
      if (mutationTimeout) clearTimeout(mutationTimeout);
      
      // Debounce mutation observer
      mutationTimeout = setTimeout(() => {
        initScrollReveal();
        setupFallback();
      }, 300);
    }
  });

  // Observe only the main content area for changes
  const mainContent = document.querySelector('main') || document.body;
  if (mainContent) {
    observer.observe(mainContent, {
      childList: true,
      subtree: true,
    });
  }
}
