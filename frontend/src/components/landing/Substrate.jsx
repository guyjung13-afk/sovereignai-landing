import React from "react";
import { Server, Shield, Cpu } from "lucide-react";
import SectionHeading from "./SectionHeading";

const CARDS = [
  { icon: <Server size={22} />, title: "On-Premise Deployment", desc: "Your AI runs on your hardware. Full-stack sovereignty from model weights to inference engine — nothing borrowed, nothing rented." },
  { icon: <Shield size={22} />, title: "Zero Data Egress", desc: "Nothing leaves your perimeter. No telemetry, no training data leakage, no external dependencies. The membrane is inviolable." },
  { icon: <Cpu size={22} />, title: "Department-Native", desc: "Intelligence built from your institutional knowledge, not generic training data. Familiar tools, not foreign platforms." },
];

const Substrate = () => (
  <section id="substrate">
    <div className="container">
      <SectionHeading
        eyebrow="System Substrate"
        pre="Department-Native "
        gold="Intelligence Engine"
        lead="Hardware-rooted attestation. Cryptographic isolation. Deterministic performance on air-gapped infrastructure. Our architecture treats the network perimeter as an inviolable membrane. Every deployment operates at full capability without external API calls or vendor-controlled context transmission."
      />
      <div className="card-grid-3">
        {CARDS.map((c) => (
          <div key={c.title} className="substrate-card corner-frame reveal">
            <div className="icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Substrate;
