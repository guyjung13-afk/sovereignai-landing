import React, { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
varying float vGlow;
void main() {
  vec2 p = aPos;
  float d = distance(p, uMouse);
  float prox = exp(-d * 0.0045);
  vec2 dir = (p - uMouse) / max(d, 1.0);
  float ripple = sin(d * 0.045 - uTime * 3.63) * prox * 7.0;
  p += dir * (prox * 12.0 + ripple);
  p.y += sin(p.x * 0.012 + uTime * 0.55) * 1.4;
  p.x += cos(p.y * 0.010 + uTime * 0.40) * 1.1;
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = 1.2 + prox * 3.0;
  vGlow = prox;
}
`;

const FRAG = `
precision mediump float;
varying float vGlow;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  vec3 steel = vec3(0.557, 0.604, 0.686);
  vec3 gold = vec3(0.831, 0.686, 0.216);
  vec3 col = mix(steel, gold, clamp(vGlow * 1.6, 0.0, 1.0));
  float alpha = 0.10 + vGlow * 0.55;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

const ResonantField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const aPos = gl.getAttribLocation(prog, "aPos");

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(5 / 255, 7 / 255, 10 / 255, 1);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let count = 0;

    const buildGrid = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      const spacing = 30 * dpr;
      const pts = [];
      for (let y = spacing / 2; y < canvas.height; y += spacing) {
        for (let x = spacing / 2; x < canvas.width; x += spacing) {
          pts.push(x, y);
        }
      }
      count = pts.length / 2;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    buildGrid();

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const onMove = (e) => {
      mouse.tx = e.clientX * dpr;
      mouse.ty = e.clientY * dpr;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    window.addEventListener("resize", buildGrid);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = null;
    const start = performance.now();

    const draw = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", buildGrid);
    };
  }, []);

  return <canvas ref={canvasRef} className="resonant-field" data-testid="resonant-field-canvas" aria-hidden="true" />;
};

export default ResonantField;
