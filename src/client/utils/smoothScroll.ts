export const smoothScrollTo = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    // If element not found, try after a short delay (for dynamic content)
    setTimeout(() => {
      const retryElement = document.getElementById(elementId);
      if (retryElement) {
        scrollToElement(retryElement);
      }
    }, 100);
    return;
  }

  scrollToElement(element);
};

const scrollToElement = (element: HTMLElement): void => {
  // Account for fixed header height
  const headerOffset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  const start = window.pageYOffset;
  const target = offsetPosition;
  const distance = target - start;
  
  // Optimized duration calculation - smoother for shorter distances
  const duration = Math.min(Math.max(Math.abs(distance) * 0.4, 300), 1000);
  let startTime: number | null = null;
  let rafId: number | null = null;

  // Optimized easing function for smoother scroll
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const current = start + (distance * easedProgress);
    
    // Use scrollTo with behavior smooth fallback for better browser optimization
    window.scrollTo({
      top: current,
      behavior: 'auto' // We handle the animation ourselves for better control
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(animation);
    } else {
      // Ensure we end at exact target
      window.scrollTo({
        top: target,
        behavior: 'auto'
      });
      rafId = null;
    }
  };

  // Cancel any existing scroll animation
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(animation);
};