import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a Lenis smooth-scroll instance wired to GSAP's ticker so
 * ScrollTrigger stays perfectly in sync with the smooth-scrolled position.
 * Returns a cleanup function to pass to useEffect's return.
 */
export function createLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Keep ScrollTrigger positions in sync with Lenis
  lenis.on('scroll', () => ScrollTrigger.update());

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
