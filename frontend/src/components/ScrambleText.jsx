import React, { useEffect, useRef, useState } from "react";

const CHARS = "01<>/[]#$%&@ΞΔ▓░";

const scrambleAll = (text) =>
  text
    .split("")
    .map((ch) => (ch === " " ? " " : CHARS[(Math.random() * CHARS.length) | 0]))
    .join("");

const ScrambleText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const done = useRef(false);
  const [display, setDisplay] = useState(() => scrambleAll(text));

  useEffect(() => {
    const el = ref.current;
    let raf = null;
    const run = () => {
      if (done.current) return;
      done.current = true;
      const dur = 950;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const resolved = Math.floor(t * text.length);
        let out = text.slice(0, resolved);
        for (let i = resolved; i < text.length; i++) {
          out += text[i] === " " ? " " : CHARS[(Math.random() * CHARS.length) | 0];
        }
        setDisplay(out);
        if (t < 1) raf = requestAnimationFrame(step);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(step);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done.current = true;
      setDisplay(text);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={`scramble ${className}`} aria-label={text}>
      {display}
    </span>
  );
};

export default ScrambleText;
