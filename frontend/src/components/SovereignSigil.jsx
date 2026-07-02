import React from "react";

/**
 * Sovereign Sigil — hand-authored heraldic mark.
 * Concentric jurisdictional rings, hexagonal core (perimeter), inner cross axes,
 * neural nodes at cardinal points, and a central pulse core.
 * Designed for the "Sovereign-Industrial" doctrine.
 */
const SovereignSigil = ({ scrollRotation = 0 }) => {
  return (
    <svg
      className="sigil-svg"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${scrollRotation}deg)` }}
    >
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

      {/* Outermost jurisdictional ring — dashed */}
      <circle cx="200" cy="200" r="188" fill="none" stroke="#8E9AAF" strokeWidth="1" strokeDasharray="1 6" opacity="0.4" />

      {/* Outer ring */}
      <circle cx="200" cy="200" r="170" fill="none" stroke="url(#steelGrad)" strokeWidth="1.5" opacity="0.85" />

      {/* Tick marks around outer ring */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i * 6 * Math.PI) / 180;
        const r1 = 170;
        const r2 = i % 5 === 0 ? 158 : 164;
        const x1 = 200 + r1 * Math.cos(angle);
        const y1 = 200 + r1 * Math.sin(angle);
        const x2 = 200 + r2 * Math.cos(angle);
        const y2 = 200 + r2 * Math.sin(angle);
        return (
          <line
            key={`tick-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#8E9AAF"
            strokeWidth={i % 5 === 0 ? 1.2 : 0.6}
            opacity={i % 5 === 0 ? 0.75 : 0.35}
          />
        );
      })}

      {/* Cardinal labels */}
      <text x="200" y="20" textAnchor="middle" fill="#D4AF37" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="3">N</text>
      <text x="200" y="390" textAnchor="middle" fill="#8E9AAF" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="3">S</text>
      <text x="12" y="204" textAnchor="middle" fill="#8E9AAF" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="3">W</text>
      <text x="388" y="204" textAnchor="middle" fill="#8E9AAF" fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="3">E</text>

      {/* Mid ring */}
      <circle cx="200" cy="200" r="140" fill="none" stroke="#8E9AAF" strokeWidth="1" opacity="0.5" />

      {/* Hexagonal perimeter (the sovereign fortress) */}
      <polygon
        points="200,70 313,135 313,265 200,330 87,265 87,135"
        fill="none"
        stroke="url(#steelGrad)"
        strokeWidth="2"
        opacity="0.9"
      />

      {/* Inner hexagon (nested authority) */}
      <polygon
        points="200,110 278,155 278,245 200,290 122,245 122,155"
        fill="none"
        stroke="#8E9AAF"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Cross axes */}
      <line x1="200" y1="70" x2="200" y2="330" stroke="#8E9AAF" strokeWidth="0.8" opacity="0.35" />
      <line x1="87" y1="200" x2="313" y2="200" stroke="#8E9AAF" strokeWidth="0.8" opacity="0.35" />

      {/* Diagonal axes */}
      <line x1="120" y1="120" x2="280" y2="280" stroke="#8E9AAF" strokeWidth="0.6" opacity="0.25" />
      <line x1="280" y1="120" x2="120" y2="280" stroke="#8E9AAF" strokeWidth="0.6" opacity="0.25" />

      {/* Neural nodes at hex vertices */}
      {[
        [200, 70], [313, 135], [313, 265], [200, 330], [87, 265], [87, 135],
      ].map(([cx, cy], i) => (
        <g key={`node-${i}`}>
          <circle cx={cx} cy={cy} r="6" fill="#05070A" stroke="#D4AF37" strokeWidth="1.4" />
          <circle cx={cx} cy={cy} r="2" fill="#D4AF37">
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
          </circle>
        </g>
      ))}

      {/* Inner cardinal notches */}
      {[[200, 110], [278, 200], [200, 290], [122, 200]].map(([cx, cy], i) => (
        <circle key={`inner-${i}`} cx={cx} cy={cy} r="3" fill="#8E9AAF" opacity="0.8" />
      ))}

      {/* Central core — the neural pulse */}
      <circle cx="200" cy="200" r="60" fill="url(#coreGlow)" opacity="0.9">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="200" r="38" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85" />
      <circle cx="200" cy="200" r="26" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.55" />

      {/* Central emblem: interlocked S */}
      <g filter="url(#pulseCore)">
        <path
          d="M 185 185 Q 185 175 195 175 L 215 175 Q 225 175 225 185 Q 225 195 215 195 L 195 195 Q 185 195 185 205 Q 185 215 195 215 L 215 215 Q 225 215 225 225"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="200" cy="200" r="3" fill="#D4AF37">
          <animate attributeName="r" values="2;4;2" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Micro-text ring — rotating jurisdictional inscription */}
      <g style={{ transformOrigin: "200px 200px", animation: "rotateSlow 90s linear infinite" }}>
        <path id="microTextPath" d="M 200,200 m -155,0 a 155,155 0 1,1 310,0 a 155,155 0 1,1 -310,0" fill="none" />
        <text fontSize="7" fontFamily="'JetBrains Mono', monospace" fill="#8E9AAF" letterSpacing="4" opacity="0.75">
          <textPath href="#microTextPath" startOffset="0">
            SOVEREIGN · LOCAL · INTELLIGENCE · PERIMETER · ABSOLUTE · AUTHORITY · SOVEREIGN · LOCAL · INTELLIGENCE · PERIMETER · ABSOLUTE · AUTHORITY ·
          </textPath>
        </text>
      </g>
    </svg>
  );
};

export default SovereignSigil;
