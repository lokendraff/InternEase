import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Cyber Gold Particle Sphere — Canvas2D
 * Fibonacci-distributed dots on a rotating sphere with mouse repulse.
 */
function generatePoints(count, radius) {
  const pts = [], g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i;
    const x = Math.cos(t) * r * radius, z = Math.sin(t) * r * radius, yy = y * radius;
    pts.push({ hx: x, hy: yy, hz: z, x, y: yy, z, vx: 0, vy: 0, vz: 0 });
  }
  return pts;
}

export default function ParticleSphere() {
  const canvasRef = useRef(null), mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null), pointsRef = useRef([]), rotRef = useRef(0);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  const getRadius = useCallback(() => Math.min(dims.w, dims.h) * 0.30, [dims]);

  useEffect(() => { pointsRef.current = generatePoints(1200, getRadius()); }, [getRadius]);
  useEffect(() => {
    const fn = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    const mv = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const lv = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', mv); window.addEventListener('mouseleave', lv);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseleave', lv); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'), dpr = window.devicePixelRatio || 1;
    canvas.width = dims.w * dpr; canvas.height = dims.h * dpr; ctx.scale(dpr, dpr);
    const cx = dims.w / 2, cy = dims.h / 2, radius = getRadius();

    const loop = () => {
      ctx.clearRect(0, 0, dims.w, dims.h); rotRef.current += 0.0007;
      const cosR = Math.cos(rotRef.current), sinR = Math.sin(rotRef.current);
      const pts = pointsRef.current, mouse = mouseRef.current, proj = [];

      for (const p of pts) {
        const rhx = p.hx * cosR - p.hz * sinR, rhz = p.hx * sinR + p.hz * cosR;
        p.vx += (rhx - p.x) * 0.032; p.vy += (p.hy - p.y) * 0.032; p.vz += (rhz - p.z) * 0.032;
        const sc = 900 / (900 + p.z), sx = cx + p.x * sc, sy = cy + p.y * sc;
        const mdx = sx - mouse.x, mdy = sy - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 130 && md > 0) { const f = (1 - md / 130) * 14; p.vx += (mdx / md) * f; p.vy += (mdy / md) * f; p.vz += (Math.random() - 0.5) * f * 0.4; }
        p.vx *= 0.91; p.vy *= 0.91; p.vz *= 0.91;
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        const fs = 900 / (900 + p.z);
        proj.push({ fx: cx + p.x * fs, fy: cy + p.y * fs, z: p.z, scale: fs });
      }
      proj.sort((a, b) => b.z - a.z);
      for (const { fx, fy, scale, z } of proj) {
        const r = Math.max(0.4, 1.7 * scale), depth = (z + radius) / (2 * radius), alpha = 0.12 + 0.68 * (1 - depth);
        ctx.beginPath(); ctx.arc(fx, fy, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(251,191,36,${alpha})`; ctx.fill();
        if (alpha > 0.45) { ctx.beginPath(); ctx.arc(fx, fy, r * 2.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,158,11,${alpha * 0.1})`; ctx.fill(); }
      }
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [dims, getRadius]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }} />;
}
