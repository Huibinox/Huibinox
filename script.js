const canvas = document.querySelector("#biofield");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let particles = [];
let frame = 0;

const colors = ["#55d6be", "#91df7d", "#e0b15c", "#ff6b6b"];

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  seedParticles();
}

function seedParticles() {
  const count = Math.min(92, Math.max(42, Math.floor((width * height) / 18000)));
  particles = Array.from({ length: count }, (_, index) => {
    const group = index % colors.length;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 2.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: colors[group],
      alpha: 0.18 + Math.random() * 0.42,
    };
  });
}

function drawAxes() {
  const left = width * 0.08;
  const bottom = height * 0.84;
  const axisWidth = Math.min(width * 0.28, 360);
  const axisHeight = Math.min(height * 0.28, 240);

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = "#9eaca7";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, bottom);
  ctx.lineTo(left + axisWidth, bottom);
  ctx.moveTo(left, bottom);
  ctx.lineTo(left, bottom - axisHeight);
  ctx.stroke();

  ctx.globalAlpha = 0.14;
  for (let i = 1; i < 5; i += 1) {
    const x = left + (axisWidth / 5) * i;
    const y = bottom - (axisHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, bottom - axisHeight);
    ctx.moveTo(left, y);
    ctx.lineTo(left + axisWidth, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    ctx.save();
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawConnections() {
  ctx.save();
  ctx.lineWidth = 0.7;
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 118) {
        ctx.globalAlpha = (1 - distance / 118) * 0.14;
        ctx.strokeStyle = a.color;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawScanline() {
  const y = (frame * 0.45) % (height + 120) - 60;
  const gradient = ctx.createLinearGradient(0, y - 30, 0, y + 30);
  gradient.addColorStop(0, "rgba(85, 214, 190, 0)");
  gradient.addColorStop(0.5, "rgba(85, 214, 190, 0.13)");
  gradient.addColorStop(1, "rgba(85, 214, 190, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, y - 30, width, 60);
}

function render() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#05070a";
  ctx.fillRect(0, 0, width, height);
  drawAxes();
  drawConnections();
  drawParticles();
  if (!prefersReducedMotion) {
    drawScanline();
    frame += 1;
    requestAnimationFrame(render);
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
render();
