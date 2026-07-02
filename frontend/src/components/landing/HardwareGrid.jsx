import React from "react";

const HardwareGrid = () => (
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
);

export default HardwareGrid;
