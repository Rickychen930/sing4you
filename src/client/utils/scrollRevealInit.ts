/**
 * Initialize scroll reveal untuk semua elemen dengan class 'scroll-reveal-io'
 * Menggunakan Intersection Observer untuk performa yang lebih baik
 */
export const initScrollReveal = () => {
  // Skip jika sudah di-initialize atau jika user prefers reduced motion
  if (typeof window === 'undefined') {
    return;
  }

  // Jika user prefers reduced motion, langsung reveal semua elemen
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
          // Unobserve setelah revealed untuk performa
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01, // Very low threshold untuk trigger lebih cepat
      rootMargin: '0px 0px -50px 0px', // Small negative margin untuk trigger sedikit lebih awal
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

  return () => {
    elements.forEach((element) => {
      observer.unobserve(element);
    });
  };
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
    
    // Cleanup fallback timer jika semua sudah ter-reveal lebih cepat
    checkInterval = setInterval(() => {
      const unrevealed = document.querySelectorAll('.scroll-reveal-io:not(.revealed)');
      if (unrevealed.length === 0) {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        if (checkInterval) clearInterval(checkInterval);
      }
    }, 500);
  };

  const initialize = () => {
    // Initial load - multiple attempts untuk memastikan semua ter-catch
    setTimeout(() => {
      initScrollReveal();
    }, 100);
    
    setTimeout(() => {
      initScrollReveal(); // Second attempt
    }, 300);
    
    setupFallback();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Re-initialize setelah route changes (untuk SPA)
  let lastPath = window.location.pathname;
  const checkRouteChange = () => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      // Clear existing timers
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (checkInterval) clearInterval(checkInterval);
      
      setTimeout(() => {
        initScrollReveal();
        setTimeout(() => {
          initScrollReveal(); // Second attempt
        }, 200);
        setupFallback();
      }, 200);
    }
  };

  // Check setiap 100ms untuk route changes
  setInterval(checkRouteChange, 100);
}
