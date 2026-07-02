import React from "react";
import { Zap, HeartPulse, Radar, Scale, Database } from "lucide-react";
import SectionHeading from "./SectionHeading";

const VERTICALS = [
  { idx: "01", title: "Energy", icon: <Zap className="icon-large" />, desc: "SCADA-adjacent intelligence for grid optimization, predictive maintenance, and operational continuity. Air-gapped for critical infrastructure." },
  { idx: "02", title: "Healthcare", icon: <HeartPulse className="icon-large" />, desc: "HIPAA-sovereign diagnostics and patient intelligence. Models that never transmit PHI. On-premise inference for radiology, pathology, and clinical decisions." },
  { idx: "03", title: "Defense", icon: <Radar className="icon-large" />, desc: "Tactical AI for disconnected environments. Hardened inference at the edge. Zero-trust architectures for classified workloads and mission-critical operations." },
  { idx: "04", title: "Law", icon: <Scale className="icon-large" />, desc: "Privilege-preserving document intelligence. Local LLM review for contracts, discovery, and compliance without exposing client data to third-party APIs." },
  { idx: "05", title: "Private Data", icon: <Database className="icon-large" />, desc: "Enterprise-grade data vaults with local AI processing. Custom models trained on proprietary datasets that never leave your physical perimeter." },
];

const Verticals = () => (
  <section id="verticals">
    <div className="container">
      <SectionHeading
        eyebrow="Deployment Domains"
        pre="Industries We "
        gold="Fortify"
        lead="Purpose-built AI deployments for sectors where data sovereignty is not optional. Every deployment is configured for the organization's specific operational DNA."
      />
      <div className="industry-grid reveal">
        {VERTICALS.map((v) => (
          <div key={v.idx} className="industry-card">
            <div className="idx">// {v.idx}</div>
            {v.icon}
            <h4>{v.title}</h4>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Verticals;
