import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollOrGo = (id) => (e) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <svg className="brand-mark" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill="none" stroke="#D4AF37" strokeWidth="1.6" />
          <polygon points="20,12 27,16 27,24 20,28 13,24 13,16" fill="none" stroke="#8E9AAF" strokeWidth="1" />
          <circle cx="20" cy="20" r="3" fill="#D4AF37" />
        </svg>
        <span>Sovereign<span style={{ color: "#D4AF37" }}>AI</span></span>
      </Link>
      <div className="nav-links">
        <a href="/#substrate" onClick={scrollOrGo("substrate")}>System</a>
        <a href="/#architecture" onClick={scrollOrGo("architecture")}>Architecture</a>
        <a href="/#verticals" onClick={scrollOrGo("verticals")}>Verticals</a>
        <Link to="/manifesto">Manifesto</Link>
        <a href="/#inquiry" onClick={scrollOrGo("inquiry")}>Inquiry</a>
      </div>
    </nav>
  );
};

export default Nav;
