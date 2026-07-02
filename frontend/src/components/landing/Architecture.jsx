import React from "react";
import { Lock, Zap, Activity, Shield } from "lucide-react";
import SectionHeading from "./SectionHeading";

const MODULES = [
  { idx: "01", title: "Perimeter Lock", desc: "Data stays inside your jurisdictional boundary. Zero transit. Zero exfiltration surface.", tag: "VAULT", icon: <Lock size={18} />, depth: "0.030" },
  { idx: "02", title: "Local Runtime", desc: "Models execute on your bare-metal hardware. No cloud dependency, no vendor-controlled context.", tag: "SPIRE", icon: <Zap size={18} />, depth: "0.055" },
  { idx: "03", title: "Full Audit", desc: "Agents operate with complete local traceability. Deterministic logic replay for every decision.", tag: "ENCLAVE", icon: <Activity size={18} />, depth: "0.040" },
  { idx: "04", title: "Autonomy", desc: "Zero external dependencies. Continued operation in total disconnection. Sovereign under siege.", tag: "CITADEL", icon: <Shield size={18} />, depth: "0.065" },
];

const ModuleBlock = ({ m }) => (
  <div className="module-block" data-parallax={m.depth} data-testid={`module-block-${m.tag.toLowerCase()}`}>
    <div className="module-header">
      <span className="module-index">{m.idx}</span>
      <span className="led"><span className="led-dot" />ONLINE</span>
    </div>
    <div style={{ color: "#D4AF37", marginBottom: 18 }}>{m.icon}</div>
    <h4>{m.title}</h4>
    <p>{m.desc}</p>
    <div className="module-footer">
      <span>[{m.tag}]</span>
      <span className="status-ok">STATUS: SOVEREIGN</span>
    </div>
  </div>
);

const Architecture = () => (
  <section id="architecture">
    <div className="container">
      <SectionHeading
        eyebrow="Architecture"
        pre="The Sovereign "
        gold="Flow"
        lead="Four physical modules. One doctrine. Each state operates as an independent server-class module with hardware-rooted attestation and status-sovereign LED signaling."
      />
      <div className="module-grid interlock" data-testid="module-grid">
        <div className="seam" />
        {MODULES.map((m) => <ModuleBlock key={m.idx} m={m} />)}
      </div>
    </div>
  </section>
);

export default Architecture;
