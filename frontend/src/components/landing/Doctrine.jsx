import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const Doctrine = () => (
  <section id="doctrine">
    <div className="container">
      <SectionHeading eyebrow="The Doctrine" pre="The Sovereign " gold="Manifesto" />
      <div className="manifesto-block reveal corner-frame">
        <span className="quote-mark">“</span>
        <p className="quote">
          SovereignAI rejects the architecture of extraction. We build intelligence whose
          models, retrieval indices, and execution runtimes operate wholly inside the
          physical and jurisdictional perimeter of the organization, preserving
          trust, authority, and accountability where decisions are irreversible.
        </p>
        <div className="actions">
          <Link to="/manifesto" className="btn" data-testid="doctrine-manifesto-btn">
            Read the Full Manifesto
            <ArrowRight size={14} className="arrow" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Doctrine;
