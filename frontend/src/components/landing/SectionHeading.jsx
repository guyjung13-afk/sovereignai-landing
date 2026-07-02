import React from "react";
import ScrambleText from "../ScrambleText";

const SectionHeading = ({ eyebrow, pre, gold, lead }) => (
  <>
    <div className="section-eyebrow reveal">
      <span className="eyebrow">{eyebrow}</span>
    </div>
    <h2 className="section-title reveal">
      <ScrambleText text={pre} />
      <span className="gold"><ScrambleText text={gold} /></span>
    </h2>
    {lead && <p className="section-lead reveal">{lead}</p>}
  </>
);

export default SectionHeading;
