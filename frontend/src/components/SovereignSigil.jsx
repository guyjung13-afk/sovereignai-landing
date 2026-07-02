import React from "react";

const MONO = "'JetBrains Mono', monospace";
const HEX_VERTICES = [[200, 70], [313, 135], [313, 265], [200, 330], [87, 265], [87, 135]];

const SigilDefs = () => (
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.95" />
      <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.55" />
      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8E9AAF" />
      <stop offset="50%" stopColor="#B5BFCF" />
      <stop offset="100%" stopColor="#5B6577" />
    </linearGradient>
    <filter id="pulseCore" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const TickRing = () => (
  <>
    {Array.from({ length: 60 }).map((_, i) => {
      const angle = (i * 6 * Math.PI) / 180;
      const r2 = i % 5 === 0 ? 158 : 164;
      return (
        <line
          key={`tick-${i}`}
          x1={200 + 170 * Math.cos(angle)}
          y1={200 + 170 * Math.sin(angle)}
          x2={200 + r2 * Math.cos(angle)}
          y2={200 + r2 * Math.sin(angle)}
          stroke="#8E9AAF"
          strokeWidth={i % 5 === 0 ? 1.2 : 0.6}
          opacity={i % 5 === 0 ? 0.75 : 0.35}
        />
      );
    })}
  </>
);

const CardinalLabels = () => (
  <>
    <text x="200" y="20" textAnchor="middle" fill="#D4AF37" fontFamily={MONO} fontSize="9" letterSpacing="3">N</text>
    <text x="200" y="390" textAnchor="middle" fill="#8E9AAF" fontFamily={MONO} fontSize="9" letterSpacing="3">S</text>
    <text x="12" y="204" textAnchor="middle" fill="#8E9AAF" fontFamily={MONO} fontSize="9" letterSpacing="3">W</text>
    <text x="388" y="204" textAnchor="middle" fill="#8E9AAF" fontFamily={MONO} fontSize="9" letterSpacing="3">E</text>
  </>
);

const HexFortress = () => (
  <>
    <polygon points="200,70 313,135 313,265 200,330 87,265 87,135" fill="none" stroke="url(#steelGrad)" strokeWidth="2" opacity="0.9" />
    <polygon points="200,110 278,155 278,245 200,290 122,245 122,155" fill="none" stroke="#8E9AAF" strokeWidth="1" opacity="0.55" />
    <line x1="200" y1="70" x2="200" y2="330" stroke="#8E9AAF" strokeWidth="0.8" opacity="0.35" />
    <line x1="87" y1="200" x2="313" y2="200" stroke="#8E9AAF" strokeWidth="0.8" opacity="0.35" />
    <line x1="120" y1="120" x2="280" y2="280" stroke="#8E9AAF" strokeWidth="0.6" opacity="0.25" />
    <line x1="280" y1="120" x2="120" y2="280" stroke="#8E9AAF" strokeWidth="0.6" opacity="0.25" />
  </>
);

const NeuralNodes = () => (
  <>
    {HEX_VERTICES.map(([cx, cy], i) => (
      <g key={`node-${i}`}>
        <circle cx={cx} cy={cy} r="6" fill="#05070A" stroke="#D4AF37" strokeWidth="1.4" />
        <circle cx={cx} cy={cy} r="2" fill="#D4AF37">
          <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
        </circle>
      </g>
    ))}
    {[[200, 110], [278, 200], [200, 290], [122, 200]].map(([cx, cy], i) => (
      <circle key={`inner-${i}`} cx={cx} cy={cy} r="3" fill="#8E9AAF" opacity="0.8" />
    ))}
  </>
);

const CoreEmblem = () => (
  <>
    <circle cx="200" cy="200" r="60" fill="url(#coreGlow)" opacity="0.9">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="3.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="200" r="38" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85" />
    <circle cx="200" cy="200" r="26" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.55" />
    <g filter="url(#pulseCore)">
      {/* Standard-flow S curve — the signature of integrity */}
      <path
        d="M 225 185 Q 225 175 215 175 L 195 175 Q 185 175 185 185 Q 185 195 195 195 L 215 195 Q 225 195 225 205 Q 225 215 215 215 L 195 215 Q 185 215 185 225"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="200" cy="200" r="3" fill="#D4AF37">
        <animate attributeName="r" values="2;4;2" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </g>
  </>
);

const MicroTextRing = () => (
  <g style={{ transformOrigin: "200px 200px", animation: "rotateSlow 90s linear infinite" }}>
    <path id="microTextPath" d="M 200,200 m -155,0 a 155,155 0 1,1 310,0 a 155,155 0 1,1 -310,0" fill="none" />
    <text fontSize="7" fontFamily={MONO} fill="#8E9AAF" letterSpacing="4" opacity="0.75">
      <textPath href="#microTextPath" startOffset="0">
        SOVEREIGN · LOCAL · INTELLIGENCE · PERIMETER · ABSOLUTE · AUTHORITY · SOVEREIGN · LOCAL · INTELLIGENCE · PERIMETER · ABSOLUTE · AUTHORITY ·
      </textPath>
    </text>
  </g>
);

const SovereignSigil = () => (
  <svg className="sigil-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <SigilDefs />
    <circle cx="200" cy="200" r="188" fill="none" stroke="#8E9AAF" strokeWidth="1" strokeDasharray="1 6" opacity="0.4" />
    <circle cx="200" cy="200" r="170" fill="none" stroke="url(#steelGrad)" strokeWidth="1.5" opacity="0.85" />
    <TickRing />
    <CardinalLabels />
    <circle cx="200" cy="200" r="140" fill="none" stroke="#8E9AAF" strokeWidth="1" opacity="0.5" />
    <HexFortress />
    <NeuralNodes />
    <CoreEmblem />
    <MicroTextRing />
  </svg>
);

export default SovereignSigil;
