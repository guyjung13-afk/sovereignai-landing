import React, { useEffect, useRef, useState } from "react";

const CHARS = "01<>/[]#$%&@ΞΔ▓░";

const randomChar = () => CHARS[(Math.random() * CHARS.length) | 0];

const scrambleAll = (text) =>
  text.split("").map((ch) => (ch === " " ? " " : randomChar())).join("");

const scrambleFrame = (text, progress) => {
  const resolved = Math.floor(progress * text.length);
  let out = text.slice(0, resolved);
  for (let i = resolved; i < text.length; i++) {
    out += text[i] === " " ? " " : randomChar();
  }
  return out;
};

const animateScramble = (text, setDisplay, duration = 950) => {
  let raf = null;
  const t0 = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - t0) / duration);
    setDisplay(t < 1 ? scrambleFrame(text, t) : text);
    if (t < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
};

const ScrambleText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const done = useRef(false);
  const [display, setDisplay] = useState(() => scrambleAll(text));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done.current = true;
      setDisplay(text);
      return;
    }
    let cancel = null;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            cancel = animateScramble(text, setDisplay);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      if (cancel) cancel();
    };
  }, [text]);

  return (
    <span ref={ref} className={`scramble ${className}`} aria-label={text}>
      {display}
    </span>
  );
};

export default ScrambleText;
