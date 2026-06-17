import { useEffect, useRef } from 'react';

const NODE_COUNT = 42;
const MAX_DIST = 185;
const MOUSE_RADIUS = 200;
const SPEED = 0.55;

function getRGB() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-rgb').trim() || '177, 80, 47';
}

function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove);

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 2.5,
    }));

    let rgb = getRGB();
    const observer = new MutationObserver(() => { rgb = getRGB(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        // mouse repulsion
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * 0.018;
          n.vx += dx / dist * force;
          n.vy += dy / dist * force;
        }

        // dampen
        n.vx *= 0.994;
        n.vy *= 0.994;

        // keep alive
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd < SPEED * 0.35) {
          n.vx += (Math.random() - 0.5) * 0.06;
          n.vy += (Math.random() - 0.5) * 0.06;
        }

        n.x += n.vx;
        n.y += n.vy;

        // soft bounce
        if (n.x < 0)  { n.x = 0;  n.vx = Math.abs(n.vx); }
        if (n.x > W)  { n.x = W;  n.vx = -Math.abs(n.vx); }
        if (n.y < 0)  { n.y = 0;  n.vy = Math.abs(n.vy); }
        if (n.y > H)  { n.y = H;  n.vy = -Math.abs(n.vy); }
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.38;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.55)`;
        ctx.fill();
      }

      // cursor as live network node
      if (mouse.x > 0) {
        for (const n of nodes) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.65;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
        // cursor node itself
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.75)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.65,
      }}
    />
  );
}

export default NeuralBackground;
