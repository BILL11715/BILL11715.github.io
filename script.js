const root = document.documentElement;
const orb = document.querySelector(".cursor-orb");

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--cursor-x", `${event.clientX}px`);
  root.style.setProperty("--cursor-y", `${event.clientY}px`);
  if (orb) {
    orb.style.opacity = "1";
  }
});

const revealTargets = document.querySelectorAll(
  ".section, .expertise-card, .timeline-item, .project-card, .contact, .lab-section, .services-section, .service-card, .stack-cloud span"
);

revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => observer.observe(target));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const langToggle = document.querySelector("[data-lang-toggle]");
const langCurrent = document.querySelector("[data-lang-current]");
const langNext = document.querySelector("[data-lang-next]");
let currentLanguage = "fr";

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title =
    language === "fr"
      ? "Bill Hounmenou | Data, IA & Strategie Digitale"
      : "Bill Hounmenou | Data, AI & Digital Strategy";

  document.querySelectorAll("[data-fr][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  if (langCurrent) {
    langCurrent.textContent = language.toUpperCase();
  }
  if (langNext) {
    langNext.textContent = language === "fr" ? "EN" : "FR";
  }
}

langToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "fr" ? "en" : "fr");
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

const canvas = document.querySelector(".network-canvas");
const context = canvas?.getContext("2d");
let points = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function resizeCanvas() {
  if (!canvas || !context) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const total = Math.max(42, Math.floor((window.innerWidth * window.innerHeight) / 26000));
  points = Array.from({ length: total }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.8 + 0.8,
  }));
}

function animateNetwork() {
  if (!canvas || !context) return;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

    const distanceToPointer = Math.hypot(point.x - pointer.x, point.y - pointer.y);
    if (distanceToPointer < 140) {
      point.x += (point.x - pointer.x) * 0.004;
      point.y += (point.y - pointer.y) * 0.004;
    }

    context.beginPath();
    context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    context.fillStyle = "rgba(14, 139, 127, 0.72)";
    context.fill();
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 138) {
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(239, 101, 71, ${0.16 * (1 - distance / 138)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  requestAnimationFrame(animateNetwork);
}

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateNetwork();

const heroCanvas = document.querySelector(".hero-cinema");
const heroContext = heroCanvas?.getContext("2d");
const hero = document.querySelector(".hero");
let cinemaParticles = [];
let cinemaNodes = [];
let cinemaSize = { width: 0, height: 0, ratio: 1 };

function resizeHeroCinema() {
  if (!heroCanvas || !heroContext || !hero) return;
  const rect = hero.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  cinemaSize = {
    width: Math.max(320, Math.floor(rect.width)),
    height: Math.max(520, Math.floor(rect.height)),
    ratio,
  };
  heroCanvas.width = Math.floor(cinemaSize.width * ratio);
  heroCanvas.height = Math.floor(cinemaSize.height * ratio);
  heroCanvas.style.width = `${cinemaSize.width}px`;
  heroCanvas.style.height = `${cinemaSize.height}px`;
  heroContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  cinemaParticles = Array.from({ length: 150 }, () => ({
    x: Math.random() * cinemaSize.width,
    y: Math.random() * cinemaSize.height,
    z: Math.random() * 1,
    speed: 0.18 + Math.random() * 0.8,
    hue: Math.random() > 0.6 ? "coral" : "lime",
  }));

  cinemaNodes = Array.from({ length: 28 }, (_, index) => ({
    x: cinemaSize.width * (0.42 + Math.random() * 0.56),
    y: cinemaSize.height * (0.1 + Math.random() * 0.78),
    r: 1.6 + Math.random() * 3.5,
    phase: index * 0.37,
  }));
}

function drawGlowCircle(ctx, x, y, radius, color, alpha) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, color.replace("ALPHA", alpha));
  glow.addColorStop(0.48, color.replace("ALPHA", alpha * 0.28));
  glow.addColorStop(1, color.replace("ALPHA", 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawAurora(ctx, t, width, height, offset, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let x = -80; x <= width + 100; x += 30) {
    const wave =
      height * offset +
      Math.sin(x * 0.008 + t * 2.2) * 44 +
      Math.sin(x * 0.018 - t * 1.4) * 26;
    if (x === -80) ctx.moveTo(x, wave);
    else ctx.lineTo(x, wave);
  }
  ctx.stroke();
  ctx.lineWidth = 18;
  ctx.globalAlpha = alpha * 0.16;
  ctx.stroke();
  ctx.restore();
}

function drawDataPanel(ctx, progress, width, height) {
  const scenes = [
    { label: "DISCOVER", code: "market.scan()", metric: "+ visibility" },
    { label: "STRUCTURE", code: "data.pipeline()", metric: "clean signals" },
    { label: "AUTOMATE", code: "llm.workflow()", metric: "faster ops" },
    { label: "PUBLISH", code: "dashboard.live()", metric: "KPI ready" },
    { label: "OPTIMIZE", code: "seo.growth()", metric: "+ acquisition" },
  ];
  const segment = progress * scenes.length;
  const active = Math.floor(segment) % scenes.length;
  const local = segment - active;
  const scene = scenes[active];
  const x = width * (0.64 + Math.sin(progress * Math.PI * 2) * 0.035);
  const y = height * (0.2 + Math.sin(progress * Math.PI * 4 + 1) * 0.055);
  const panelWidth = Math.min(360, width * 0.32);
  const panelHeight = 148;
  const fade = Math.sin(Math.min(1, local) * Math.PI);

  ctx.save();
  ctx.globalAlpha = 0.36 + fade * 0.5;
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(255,250,240,0.055)";
  ctx.strokeStyle = "rgba(255,250,240,0.18)";
  ctx.lineWidth = 1;
  ctx.fillRect(0, 0, panelWidth, panelHeight);
  ctx.strokeRect(0, 0, panelWidth, panelHeight);

  ctx.fillStyle = "rgba(199,222,98,0.92)";
  ctx.font = "800 12px Inter, Arial";
  ctx.fillText(`0${active + 1} ${scene.label}`, 22, 34);
  ctx.fillStyle = "rgba(255,250,240,0.78)";
  ctx.font = "700 20px Inter, Arial";
  ctx.fillText(scene.metric, 22, 72);
  ctx.fillStyle = "rgba(255,250,240,0.42)";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText(scene.code, 22, 106);

  for (let i = 0; i < 18; i += 1) {
    const barHeight = 16 + Math.sin(i * 0.9 + progress * Math.PI * 10) * 10 + i * 2;
    ctx.fillStyle = i % 3 === 0 ? "rgba(239,101,71,0.72)" : "rgba(199,222,98,0.62)";
    ctx.fillRect(panelWidth - 92 + i * 4, panelHeight - 24 - barHeight, 2, barHeight);
  }
  ctx.restore();
}

function drawHeroCinema(time = 0) {
  if (!heroCanvas || !heroContext) return;
  const ctx = heroContext;
  const width = cinemaSize.width;
  const height = cinemaSize.height;
  const loop = 30000;
  const progress = (time % loop) / loop;
  const t = progress * Math.PI * 2;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#061316");
  bg.addColorStop(0.42, "#06483f");
  bg.addColorStop(1, "#54291a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawGlowCircle(ctx, width * (0.72 + Math.sin(t) * 0.06), height * 0.24, width * 0.38, "rgba(0,191,166,ALPHA)", 0.62);
  drawGlowCircle(ctx, width * (0.88 + Math.cos(t * 0.7) * 0.04), height * 0.62, width * 0.3, "rgba(255,104,72,ALPHA)", 0.5);
  drawGlowCircle(ctx, width * 0.46, height * (0.7 + Math.sin(t * 1.3) * 0.05), width * 0.34, "rgba(255,209,102,ALPHA)", 0.32);

  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "rgba(255,250,240,0.35)";
  for (let x = width * 0.34; x < width; x += 58) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(t + x) * 18, 0);
    ctx.lineTo(x - width * 0.08, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 58) {
    ctx.beginPath();
    ctx.moveTo(width * 0.36, y + Math.cos(t + y) * 14);
    ctx.lineTo(width, y - height * 0.1);
    ctx.stroke();
  }
  ctx.restore();

  drawAurora(ctx, progress, width, height, 0.3, "rgba(217,255,87,0.86)", 1);
  drawAurora(ctx, progress + 0.24, width, height, 0.5, "rgba(0,191,166,0.86)", 0.9);
  drawAurora(ctx, progress + 0.52, width, height, 0.68, "rgba(255,104,72,0.82)", 0.68);

  cinemaParticles.forEach((particle) => {
    particle.z += particle.speed * 0.0028;
    if (particle.z > 1) {
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
      particle.z = 0;
    }
    const scale = 0.35 + particle.z * 2.8;
    const x = width * 0.54 + (particle.x - width * 0.54) * scale;
    const y = height * 0.48 + (particle.y - height * 0.48) * scale;
    const alpha = Math.max(0, 0.82 - particle.z * 0.68);
    ctx.fillStyle =
      particle.hue === "coral"
        ? `rgba(255,104,72,${alpha})`
        : `rgba(217,255,87,${alpha})`;
    ctx.fillRect(x, y, 2.2 * scale, 2.2 * scale);
  });

  ctx.save();
  ctx.globalAlpha = 0.58;
  cinemaNodes.forEach((node, index) => {
    const x = node.x + Math.sin(t * 1.4 + node.phase) * 26;
    const y = node.y + Math.cos(t * 1.1 + node.phase) * 22;
    ctx.fillStyle = index % 4 === 0 ? "rgba(255,104,72,0.9)" : "rgba(217,255,87,0.82)";
    ctx.beginPath();
    ctx.arc(x, y, node.r, 0, Math.PI * 2);
    ctx.fill();
    for (let j = index + 1; j < cinemaNodes.length; j += 1) {
      const other = cinemaNodes[j];
      const ox = other.x + Math.sin(t * 1.4 + other.phase) * 26;
      const oy = other.y + Math.cos(t * 1.1 + other.phase) * 22;
      const distance = Math.hypot(x - ox, y - oy);
      if (distance < 155) {
        ctx.strokeStyle = `rgba(255,250,240,${0.11 * (1 - distance / 155)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    }
  });
  ctx.restore();

  const pathY = height * 0.58;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(217,255,87,0.46)";
  ctx.beginPath();
  ctx.moveTo(width * 0.48, pathY);
  ctx.bezierCurveTo(width * 0.58, height * 0.24, width * 0.74, height * 0.82, width * 0.94, height * 0.44);
  ctx.stroke();
  const pulsePosition = progress < 0.88 ? progress / 0.88 : 1;
  const pulseX = width * (0.48 + pulsePosition * 0.46);
  const pulseY = pathY + Math.sin(pulsePosition * Math.PI * 3) * 110;
  drawGlowCircle(ctx, pulseX, pulseY, 58, "rgba(255,104,72,ALPHA)", 0.76);
  ctx.fillStyle = "rgba(255,250,240,0.9)";
  ctx.beginPath();
  ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawDataPanel(ctx, progress, width, height);

  requestAnimationFrame(drawHeroCinema);
}

window.addEventListener("resize", resizeHeroCinema);
resizeHeroCinema();
drawHeroCinema();
