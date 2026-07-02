import React, { useState } from "react";
import { ArrowRight, Terminal } from "lucide-react";
import SectionHeading from "./SectionHeading";

const API_BASE = process.env.REACT_APP_BACKEND_URL;
const SOVEREIGN_KEY = process.env.REACT_APP_SOVEREIGN_KEY;

const submitBriefing = (fd) =>
  fetch(`${API_BASE}/api/v1/briefing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Sovereign-Key": SOVEREIGN_KEY,
    },
    body: JSON.stringify({
      name: fd.get("name"),
      org: fd.get("org"),
      role: fd.get("role"),
      sector: fd.get("sector"),
      requirements: fd.get("brief"),
    }),
  });

const statusFor = (res) => {
  if (res.status === 429) return "CHANNEL SATURATED · STAND BY";
  if (!res.ok) return "TRANSMISSION FAILED · RETRY";
  return "TRANSMISSION SUCCESSFUL · BRIEFING QUEUED";
};

const BriefingTerminal = () => {
  const [formStatus, setFormStatus] = useState("AWAITING TRANSMISSION");
  const [statusOk, setStatusOk] = useState(false);
  const [transmitting, setTransmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (transmitting) return;
    const form = e.target;
    setTransmitting(true);
    setStatusOk(false);
    setFormStatus("TRANSMITTING…");
    try {
      const res = await submitBriefing(new FormData(form));
      setFormStatus(statusFor(res));
      if (res.ok) {
        setStatusOk(true);
        form.reset();
      }
    } catch {
      setFormStatus("SIGNAL LOST · CHECK PERIMETER");
    } finally {
      setTransmitting(false);
    }
  };

  return (
    <section id="inquiry">
      <div className="container">
        <SectionHeading
          eyebrow="Engagement"
          pre="Request Sovereign "
          gold="Briefing"
          lead="Begin the transition to Department-Native Intelligence. All communications route through a hardened intake channel."
        />
        <div className="form-terminal interlock" data-testid="briefing-terminal">
          <div className="seam" />
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
          <form onSubmit={handleSubmit} className="form-body" data-testid="briefing-form">
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Enter designation" required data-testid="briefing-name-input" />
              </div>
              <div className="form-field">
                <label>Organization</label>
                <input type="text" name="org" placeholder="Institutional entity" required data-testid="briefing-org-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Role</label>
                <input type="text" name="role" placeholder="Position of authority" required data-testid="briefing-role-input" />
              </div>
              <div className="form-field">
                <label>Use Case / Sector</label>
                <select name="sector" required defaultValue="" data-testid="briefing-sector-select">
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
                <textarea name="brief" placeholder="Describe operational context, jurisdictional constraints, and sovereignty requirements…" required data-testid="briefing-requirements-textarea" />
              </div>
            </div>
            <div className="form-submit">
              <div className={`form-status ${statusOk ? "ok" : ""}`} data-testid="briefing-status">
                {statusOk && <span style={{ marginRight: 10 }}>✓</span>}
                {formStatus}
              </div>
              <button type="submit" className="btn" disabled={transmitting} data-testid="briefing-submit-btn">
                Schedule Technical Discovery
                <ArrowRight size={14} className="arrow" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BriefingTerminal;
