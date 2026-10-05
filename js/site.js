// ── Particle canvas ─────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, pts;
  let rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim();
  document.addEventListener('themechange', () => {
    rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim();
  });

  function initCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.2 + 0.4,
      a: Math.random() * 0.3 + 0.06
    }));
  }
  initCanvas();
  window.addEventListener('resize', initCanvas);

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${p.a})`;
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 125) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${rgb},${0.055*(1-d/125)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
}

// ── Scroll reveal ───────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1 });

document.querySelectorAll('.tl-item, .skill-cat, .proj-card, .cert-card, .shot').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  obs.observe(el);
});

// ── Image lightbox ──────────────────────────────────────
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lb-cap');
  document.querySelectorAll('[data-zoom]').forEach(el => {
    el.addEventListener('click', ev => {
      ev.preventDefault();
      const img = el.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = el.getAttribute('data-zoom') || img.alt;
      lb.showModal();
    });
  });
  lb.addEventListener('click', () => lb.close());
}
