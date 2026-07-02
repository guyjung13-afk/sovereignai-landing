import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-title">Sovereign<span style={{ color: "#D4AF37" }}>AI</span></div>
          <p>
            Department-Native Intelligence for institutions where autonomy is not optional.
            Hardware-rooted. Air-gapped. Absolute.
          </p>
        </div>
        <div className="footer-col">
          <h5>Doctrine</h5>
          <ul>
            <li><a href="/manifesto">Manifesto</a></li>
            <li><a href="/#substrate">Substrate</a></li>
            <li><a href="/#architecture">Architecture</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Deployment</h5>
          <ul>
            <li><a href="/#verticals">Energy</a></li>
            <li><a href="/#verticals">Healthcare</a></li>
            <li><a href="/#verticals">Defense</a></li>
            <li><a href="/#verticals">Law</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="/#inquiry">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2026 SovereignAI LLC — All Rights Reserved</div>
        <div>Jung Lineage · Est. 1238 · 963 Hz Resonance</div>
      </div>
    </footer>
  );
};

export default Footer;
