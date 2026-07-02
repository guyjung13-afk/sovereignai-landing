import { useEffect } from "react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const createScrollState = () => ({
  target: window.scrollY,
  current: window.scrollY,
  raf: null,
  active: false,
});

const useMomentumScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const s = createScrollState();
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const tick = () => {
      s.current += (s.target - s.current) * 0.085;
      if (Math.abs(s.target - s.current) < 0.5) {
        s.current = s.target;
        s.active = false;
      }
      window.scrollTo(0, s.current);
      if (s.active) s.raf = requestAnimationFrame(tick);
    };

    const syncToNative = () => {
      s.target = window.scrollY;
      s.current = window.scrollY;
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (!s.active) syncToNative();
      s.target = clamp(s.target + delta, 0, maxScroll());
      if (!s.active) {
        s.active = true;
        s.raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      if (!s.active) syncToNative();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, []);
};

export default useMomentumScroll;
