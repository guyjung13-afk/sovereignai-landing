import React from "react";
import SectionHeading from "./SectionHeading";

const DEPLOYMENTS = [
  { tag: "Live Pilot · Energy Sector", title: "Energy Operations", side: "from-left", desc: "Real-time trading desk and ETRM optimization pilots for major energy operators. Reducing multi-minute refresh lags to sub-second visibility, with all pricing, position, and counterparty data resident on-premise." },
  { tag: "Live Pilot · Professional Services", title: "Privileged Intelligence", side: "from-right", desc: "Privilege-preserving intelligence dashboards for high-compliance professional services firms, securing client data within dedicated vaults. Zero exposure to third-party model providers." },
];

const Validation = () => (
  <section id="validation">
    <div className="container">
      <SectionHeading
        eyebrow="Validation"
        pre="Active "
        gold="Deployments"
        lead="Proving the Sovereign model across high-stakes industrial environments where irreversibility and cost of failure are absolute."
      />
      <div className="deployment-grid">
        {DEPLOYMENTS.map((d) => (
          <div key={d.title} className={`deployment-card corner-frame reveal ${d.side}`}>
            <div className="tag">{d.tag}</div>
            <h4>{d.title}</h4>
            <p>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Validation;
