const canvas = document.querySelector("#biofield");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let marks = [];
let frame = 0;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  seedMarks();
}

function seedMarks() {
  const count = Math.min(120, Math.max(54, Math.floor((width * height) / 15000)));
  marks = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 8 + Math.random() * 42,
    speed: 0.05 + Math.random() * 0.12,
    alpha: 0.025 + Math.random() * 0.09,
  }));
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#050505");
  gradient.addColorStop(0.54, "#080807");
  gradient.addColorStop(1, "#030303");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const horizon = height * 0.72;
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#eeeae1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.06, horizon);
  ctx.lineTo(width * 0.94, horizon + Math.sin(frame * 0.006) * 4);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#aebec0";
  ctx.fillRect(width * 0.5 - 0.5, 0, 1, height);
  ctx.restore();
}

function drawMarks() {
  ctx.save();
  ctx.strokeStyle = "#eeeae1";
  ctx.lineWidth = 1;
  for (const mark of marks) {
    if (!prefersReducedMotion) {
      mark.y += mark.speed;
      if (mark.y > height + 50) {
        mark.y = -50;
        mark.x = Math.random() * width;
      }
    }
    ctx.globalAlpha = mark.alpha;
    ctx.beginPath();
    ctx.moveTo(mark.x, mark.y);
    ctx.lineTo(mark.x + 0.8, mark.y + mark.length);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrain() {
  ctx.save();
  for (let i = 0; i < 180; i += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const shade = 160 + Math.random() * 70;
    ctx.globalAlpha = 0.025 + Math.random() * 0.035;
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade - 8})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function render() {
  drawBackground();
  drawMarks();
  drawGrain();

  if (!prefersReducedMotion) {
    frame += 1;
    requestAnimationFrame(render);
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
render();
