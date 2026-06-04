import { useEffect, useRef } from "react";

const SYMBOLS = ["∫", "∑", "π", "∞", "∂", "√", "±", "Δ", "θ", "λ", "α", "β", "eˣ", "dx", "dy", "lim", "sin", "cos", "f(x)", "y'", "→", "≈", "≠", "≤", "≥", "∀", "∃", "∈", "⊂"];

const COLORS = [
  [59, 130, 246],   // blue
  [139, 92, 246],   // violet
  [236, 72, 153],   // pink
  [16, 185, 129],   // emerald
  [245, 158, 11],   // amber
  [99, 102, 241],   // indigo
];

export default function MathAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles with diverse behaviors
    const particles = [];
    for (let i = 0; i < 55; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        freqX: 0.002 + Math.random() * 0.008,
        freqY: 0.003 + Math.random() * 0.01,
        ampX: 0.2 + Math.random() * 1.2,
        ampY: 0.15 + Math.random() * 0.9,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: 10 + Math.random() * 16,
        baseOpacity: 0.04 + Math.random() * 0.09,
        color,
        pulseFreq: 0.01 + Math.random() * 0.04,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    // Sporadic glowing dots
    const sparks = [];
    const maxSparks = 12;

    // Wave definitions
    const waves = [
      { freq: 0.018, amp: 55, speed: 0.013, color: [59, 130, 246], alpha: 0.16, offsetY: -30 },
      { freq: 0.027, amp: 35, speed: -0.019, color: [139, 92, 246], alpha: 0.12, offsetY: 20 },
      { freq: 0.009, amp: 70, speed: 0.007, color: [236, 72, 153], alpha: 0.10, offsetY: -10 },
      { freq: 0.035, amp: 25, speed: 0.025, color: [16, 185, 129], alpha: 0.11, offsetY: 40 },
      { freq: 0.014, amp: 90, speed: -0.011, color: [99, 102, 241], alpha: 0.08, offsetY: 0, damped: true },
    ];

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.5;
      const cy = H * 0.52;

      // ---- Waves ----
      waves.forEach((w) => {
        ctx.strokeStyle = `rgba(${w.color[0]},${w.color[1]},${w.color[2]},${w.alpha})`;
        ctx.lineWidth = 1.5 + Math.random() * 1.5;
        ctx.beginPath();
        let started = false;
        for (let px = -20; px < W + 20; px += 3) {
          const nx = (px - cx) / 55;
          let ny = Math.sin(nx * w.freq * 55 + t * w.speed) * w.amp;
          if (w.damped) {
            ny *= Math.exp(-Math.abs(nx) * 0.04);
          }
          const py = cy + w.offsetY - ny;
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      // ---- Glowing dots along a random wave ----
      const dotX = cx + Math.sin(t * 0.031) * 120;
      const dotNX = (dotX - cx) / 55;
      const dotNY = Math.sin(dotNX * 0.018 * 55 + t * 0.013) * 55;
      const dotY = cy - 30 - dotNY;

      const grad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 22);
      grad.addColorStop(0, "rgba(59,130,246,0.3)");
      grad.addColorStop(0.4, "rgba(99,102,241,0.12)");
      grad.addColorStop(1, "rgba(99,102,241,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(dotX, dotY, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(59,130,246,0.55)";
      ctx.beginPath(); ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2); ctx.fill();

      // Second glow dot on a different wave
      const d2x = cx - 60 + Math.cos(t * 0.023) * 140;
      const d2nx = (d2x - cx) / 55;
      const d2ny = Math.sin(d2nx * 0.035 * 55 - t * 0.025) * 25;
      const d2y = cy + 40 - d2ny;
      const g2 = ctx.createRadialGradient(d2x, d2y, 0, d2x, d2y, 16);
      g2.addColorStop(0, "rgba(16,185,129,0.28)");
      g2.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(d2x, d2y, 16, 0, Math.PI * 2); ctx.fill();

      // ---- Sporadic sparks ----
      if (Math.random() < 0.25 && sparks.length < maxSparks) {
        const sc = COLORS[Math.floor(Math.random() * COLORS.length)];
        sparks.push({
          x: Math.random() * W,
          y: Math.random() * H,
          life: 1,
          decay: 0.008 + Math.random() * 0.025,
          radius: 2 + Math.random() * 8,
          color: sc,
        });
      }
      sparks.forEach((s, i) => {
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); return; }
        const r = s.radius * s.life;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        g.addColorStop(0, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${s.life * 0.35})`);
        g.addColorStop(1, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
      });

      // ---- Particles with organic movement ----
      particles.forEach((p) => {
        // Sinusoidal drift instead of linear
        const driftX = Math.sin(t * p.freqX + p.phaseX) * p.ampX;
        const driftY = Math.cos(t * p.freqY + p.phaseY) * p.ampY;
        p.x += driftX;
        p.y += driftY;

        // Wrap around
        if (p.x < -40) p.x = W + 40;
        if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        if (p.y > H + 40) p.y = -40;

        // Pulse opacity
        const pulse = 0.5 + 0.5 * Math.sin(t * p.pulseFreq + p.phaseX);
        const alpha = p.baseOpacity * (0.6 + 0.4 * pulse);

        // Rotation
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha})`;
        ctx.font = `${p.size}px "Georgia", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });

      // ---- Occasional faint connecting lines between nearby particles ----
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.04;
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ---- Ghost parabola drifting slowly ----
      const paraShift = Math.sin(t * 0.008) * 30;
      const paraTilt = Math.sin(t * 0.006) * 0.003;
      ctx.strokeStyle = "rgba(139,92,246,0.10)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let px = -20; px < W + 20; px += 4) {
        const nx = (px - cx + paraShift) / 60;
        const ny = (nx * nx * (1 + paraTilt) - 1.5) * 28;
        const py = cy - ny;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Ghost cubic curve
      ctx.strokeStyle = "rgba(245,158,11,0.07)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      started = false;
      const cShift = Math.cos(t * 0.01) * 20;
      for (let px = -20; px < W + 20; px += 4) {
        const nx = (px - cx + cShift) / 70;
        const ny = (nx * nx * nx * 0.3 - nx * 2) * 20;
        const py = cy + 50 - ny;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
