import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Lock,
  Cpu,
  Zap,
  Activity,
  Server,
  HeartPulse,
  Scale,
  Database,
  Radar,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import SovereignSigil from "../components/SovereignSigil";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [formStatus, setFormStatus] = useState("AWAITING TRANSMISSION");
  const [statusOk, setStatusOk] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("TRANSMITTING…");
    setStatusOk(false);
    setTimeout(() => {
      setFormStatus("BRIEFING QUEUED · SECURE CHANNEL OPEN");
      setStatusOk(true);
      e.target.reset();
    }, 1200);
  };

  // Scroll-driven micro rotation of the sigil (up to ~6° for tactile 3D depth)
  const sigilRotation = Math.min(scrollY * 0.02, 6);

  return (
    <>
      <div className="light-leak l1" />
      <div className="light-leak l2" />
      <div className="light-leak l3" />

      <Nav />

      {/* HERO */}
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
              <a href="#inquiry" className="btn" onClick={(e) => { e.preventDefault(); document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" }); }}>
                Request Technical Discovery
                <ArrowRight size={14} className="arrow" />
              </a>
              <Link to="/manifesto" className="btn btn-ghost">
                Read Manifesto
                <ArrowUpRight size={14} className="arrow" />
              </Link>
            </div>
          </div>
          <div className="sigil-wrap">
            <SovereignSigil scrollRotation={sigilRotation} />
          </div>
        </div>

        <div className="hero-ticker">
          <div><span className="dot" />STATUS: SOVEREIGN · PERIMETER LOCKED</div>
          <div>NODE 01 · AIR-GAPPED · 963 Hz</div>
          <div>V2.0 · DEPARTMENT-NATIVE RUNTIME</div>
        </div>
      </section>

      {/* SUBSTRATE */}
      <section id="substrate">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">System Substrate</span>
          </div>
          <h2 className="section-title reveal">Department-Native <span className="gold">Intelligence Engine</span></h2>
          <p className="section-lead reveal">
            Hardware-rooted attestation. Cryptographic isolation. Deterministic performance
            on air-gapped infrastructure. Our architecture treats the network perimeter as an
            inviolable membrane. Every deployment operates at full capability without external
            API calls or vendor-controlled context transmission.
          </p>

          <div className="card-grid-3">
            <div className="substrate-card corner-frame reveal">
              <div className="icon"><Server size={22} /></div>
              <h3>On-Premise Deployment</h3>
              <p>Your AI runs on your hardware. Full-stack sovereignty from model weights to inference engine — nothing borrowed, nothing rented.</p>
            </div>
            <div className="substrate-card corner-frame reveal">
              <div className="icon"><Shield size={22} /></div>
              <h3>Zero Data Egress</h3>
              <p>Nothing leaves your perimeter. No telemetry, no training data leakage, no external dependencies. The membrane is inviolable.</p>
            </div>
            <div className="substrate-card corner-frame reveal">
              <div className="icon"><Cpu size={22} /></div>
              <h3>Department-Native</h3>
              <p>Intelligence built from your institutional knowledge, not generic training data. Familiar tools, not foreign platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE / MODULE BLOCKS */}
      <section id="architecture">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">Architecture</span>
          </div>
          <h2 className="section-title reveal">The Sovereign <span className="gold">Flow</span></h2>
          <p className="section-lead reveal">
            Four physical modules. One doctrine. Each state operates as an independent server-class module with hardware-rooted attestation and status-sovereign LED signaling.
          </p>

          <div className="module-grid reveal">
            {[
              { idx: "01", title: "Perimeter Lock", desc: "Data stays inside your jurisdictional boundary. Zero transit. Zero exfiltration surface.", tag: "VAULT", icon: <Lock size={18} /> },
              { idx: "02", title: "Local Runtime", desc: "Models execute on your bare-metal hardware. No cloud dependency, no vendor-controlled context.", tag: "SPIRE", icon: <Zap size={18} /> },
              { idx: "03", title: "Full Audit", desc: "Agents operate with complete local traceability. Deterministic logic replay for every decision.", tag: "ENCLAVE", icon: <Activity size={18} /> },
              { idx: "04", title: "Autonomy", desc: "Zero external dependencies. Continued operation in total disconnection. Sovereign under siege.", tag: "CITADEL", icon: <Shield size={18} /> },
            ].map((m) => (
              <div key={m.idx} className="module-block">
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
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="verticals">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">Deployment Domains</span>
          </div>
          <h2 className="section-title reveal">Industries We <span className="gold">Fortify</span></h2>
          <p className="section-lead reveal">
            Purpose-built AI deployments for sectors where data sovereignty is not optional. Every deployment is configured for the organization's specific operational DNA.
          </p>

          <div className="industry-grid reveal">
            {[
              { idx: "01", title: "Energy", icon: <Zap className="icon-large" />, desc: "SCADA-adjacent intelligence for grid optimization, predictive maintenance, and operational continuity. Air-gapped for critical infrastructure." },
              { idx: "02", title: "Healthcare", icon: <HeartPulse className="icon-large" />, desc: "HIPAA-sovereign diagnostics and patient intelligence. Models that never transmit PHI. On-premise inference for radiology, pathology, and clinical decisions." },
              { idx: "03", title: "Defense", icon: <Radar className="icon-large" />, desc: "Tactical AI for disconnected environments. Hardened inference at the edge. Zero-trust architectures for classified workloads and mission-critical operations." },
              { idx: "04", title: "Law", icon: <Scale className="icon-large" />, desc: "Privilege-preserving document intelligence. Local LLM review for contracts, discovery, and compliance without exposing client data to third-party APIs." },
              { idx: "05", title: "Private Data", icon: <Database className="icon-large" />, desc: "Enterprise-grade data vaults with local AI processing. Custom models trained on proprietary datasets that never leave your physical perimeter." },
            ].map((v) => (
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

      {/* VALIDATION / ACTIVE DEPLOYMENTS */}
      <section id="validation">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">Validation</span>
          </div>
          <h2 className="section-title reveal">Active <span className="gold">Deployments</span></h2>
          <p className="section-lead reveal">
            Proving the Sovereign model across high-stakes industrial environments where irreversibility and cost of failure are absolute.
          </p>

          <div className="deployment-grid reveal">
            <div className="deployment-card corner-frame">
              <div className="tag">Live Pilot · Energy Sector</div>
              <h4>Energy Operations</h4>
              <p>
                Real-time trading desk and ETRM optimization pilots for major energy operators.
                Reducing multi-minute refresh lags to sub-second visibility, with all pricing,
                position, and counterparty data resident on-premise.
              </p>
            </div>
            <div className="deployment-card corner-frame">
              <div className="tag">Live Pilot · Professional Services</div>
              <h4>Privileged Intelligence</h4>
              <p>
                Privilege-preserving intelligence dashboards for high-compliance professional
                services firms, securing client data within dedicated vaults. Zero exposure to
                third-party model providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HARDWARE */}
      <section className="hardware-section">
        <div className="container">
          <div className="hardware-eyebrow reveal">Hardware Agnostic</div>
          <div className="hardware-caption reveal">Optimized for deterministic performance across global silicon leaders.</div>
          <div className="hardware-logos reveal">
            {["NVIDIA", "AMD", "INTEL", "APPLE SILICON"].map((h) => (
              <div key={h} className="hardware-logo">{h}</div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO TEASER */}
      <section id="doctrine">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">The Doctrine</span>
          </div>
          <h2 className="section-title reveal">The Sovereign <span className="gold">Manifesto</span></h2>

          <div className="manifesto-block reveal corner-frame">
            <span className="quote-mark">“</span>
            <p className="quote">
              SovereignAI rejects the architecture of extraction. We build intelligence whose
              models, retrieval indices, and execution runtimes operate wholly inside the
              physical and jurisdictional perimeter of the organization, preserving
              trust, authority, and accountability where decisions are irreversible.
            </p>
            <div className="actions">
              <Link to="/manifesto" className="btn">
                Read the Full Manifesto
                <ArrowRight size={14} className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY / CLANDESTINE BRIEFING */}
      <section id="inquiry">
        <div className="container">
          <div className="section-eyebrow reveal">
            <span className="eyebrow">Engagement</span>
          </div>
          <h2 className="section-title reveal">Request Sovereign <span className="gold">Briefing</span></h2>
          <p className="section-lead reveal">
            Begin the transition to Department-Native Intelligence. All communications route through a hardened intake channel.
          </p>

          <div className="form-terminal reveal">
            <div className="form-terminal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Terminal size={14} />
                <span>SVRN:// clandestine-briefing/intake.exe</span>
              </div>
              <div className="dots">
                <span className="active" />
                <span />
                <span />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="form-body">
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="Enter designation" required />
                </div>
                <div className="form-field">
                  <label>Organization</label>
                  <input type="text" name="org" placeholder="Institutional entity" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Role</label>
                  <input type="text" name="role" placeholder="Position of authority" required />
                </div>
                <div className="form-field">
                  <label>Use Case / Sector</label>
                  <select name="sector" required defaultValue="">
                    <option value="" disabled>Select Domain</option>
                    <option value="energy">Energy</option>
                    <option value="defense">Defense</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="law">Law</option>
                    <option value="other">Other Institutional</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
                <div className="form-field">
                  <label>Briefing Requirements</label>
                  <textarea name="brief" placeholder="Describe operational context, jurisdictional constraints, and sovereignty requirements…" required />
                </div>
              </div>
              <div className="form-submit">
                <div className={`form-status ${statusOk ? "ok" : ""}`}>
                  {statusOk && <span style={{ marginRight: 10 }}>✓</span>}
                  {formStatus}
                </div>
                <button type="submit" className="btn">
                  Schedule Technical Discovery
                  <ArrowRight size={14} className="arrow" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
