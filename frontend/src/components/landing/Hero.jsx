import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SovereignSigil from "../SovereignSigil";

const useWeightedRotation = (ref) => {
  useEffect(() => {
    let cur = 0;
    let vel = 0;
    let raf;
    const tick = () => {
      const target = Math.min(window.scrollY * 0.03, 14);
      vel += (target - cur) * 0.016;
      vel *= 0.9;
      cur += vel;
      if (ref.current) {
        ref.current.style.transform = `rotate(${cur.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
};

const Hero = () => {
  const sigilRef = useRef(null);
  useWeightedRotation(sigilRef);

  const scrollToInquiry = (e) => {
    e.preventDefault();
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div>
          <div className="section-eyebrow">
            <span className="eyebrow">Sovereign Local Artificial Intelligence</span>
          </div>
          <h1>
            <span className="breakword">Your AI.</span>
            <span className="breakword">Your Data.</span>
            <span className="breakword gold-word">Your Privacy.</span>
          </h1>
          <p className="hero-lead">
            SovereignAI terminates the compromise between intelligence and autonomy.
            We architect Department-Native Intelligence runtimes that operate wholly within
            your jurisdictional perimeter. No cloud dependency. No data extraction.
            Absolute operational sovereignty.
          </p>
          <div className="hero-actions">
            <a href="#inquiry" className="btn" data-testid="hero-discovery-btn" onClick={scrollToInquiry}>
              Request Technical Discovery
              <ArrowRight size={14} className="arrow" />
            </a>
            <Link to="/manifesto" className="btn btn-ghost" data-testid="hero-manifesto-btn">
              Read Manifesto
              <ArrowUpRight size={14} className="arrow" />
            </Link>
          </div>
        </div>
        <div className="sigil-wrap" data-parallax="0.05">
          <div ref={sigilRef} className="sigil-spring">
            <SovereignSigil />
          </div>
        </div>
      </div>

      <div className="hero-ticker">
        <div><span className="dot" />STATUS: SOVEREIGN · PERIMETER LOCKED</div>
        <div>NODE 01 · AIR-GAPPED · 963 Hz</div>
        <div>V2.0 · DEPARTMENT-NATIVE RUNTIME</div>
      </div>
    </section>
  );
};

export default Hero;
