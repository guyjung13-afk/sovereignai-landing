import { useEffect } from "react";

const useMomentumScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = null;
    let active = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const tick = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        active = false;
      }
      window.scrollTo(0, current);
      if (active) raf = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (!active) {
        target = window.scrollY;
        current = window.scrollY;
      }
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      if (!active) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
};

export default useMomentumScroll;
