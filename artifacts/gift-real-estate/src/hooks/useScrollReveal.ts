import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attaches a subtle bidirectional scroll-reveal animation to every
 * `[data-reveal]` element inside `containerRef`.
 *
 * Elements fade + slide up as they enter the viewport when scrolling
 * down, and reverse (fade + slide down) when scrolling back up.
 * `scrub` keeps the animation perfectly in sync with scroll velocity.
 *
 * Respects `prefers-reduced-motion` — elements are immediately visible
 * when the user has requested reduced motion.
 */
export function useScrollReveal(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      container
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      return;
    }

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(
        "[data-reveal]",
        container,
      );

      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 52 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 25%",
              scrub: 1.2,
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}
