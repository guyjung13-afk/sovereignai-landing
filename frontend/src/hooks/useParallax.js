import { useEffect } from "react";

const useParallax = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!els.length) return;

    const applied = new WeakMap();
    let raf = null;

    const update = () => {
      raf = null;
      const mid = window.innerHeight / 2;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0;
        const r = el.getBoundingClientRect();
        const prev = applied.get(el) || 0;
        const baseCenter = r.top + r.height / 2 - prev;
        const offset = (baseCenter - mid) * speed;
        if (Math.abs(offset - prev) > 0.1) {
          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
          applied.set(el, offset);
        }
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
};

export default useParallax;
