// Named exports are required — default imports can silently fail to share
// the same GSAP instance across modules in a production bundle.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a Lenis smooth-scroll instance wired to GSAP's ticker so
 * ScrollTrigger stays perfectly in sync with the smooth-scrolled position.
 * Returns a cleanup function suitable for useEffect's return value.
 */
export function createLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Pass the direct function reference — not an arrow wrapper — so
  // ScrollTrigger.update receives the correct scroll event argument.
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
