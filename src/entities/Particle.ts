export interface Particle {
  id: number;
  pos: { x: number; y: number };
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alive: boolean;
}

let nextParticleId = 1;

export function createParticle(
  x: number,
  y: number,
  color: string,
  count?: number,
): Particle[] {
  const particles: Particle[] = [];
  const n = count ?? 8;
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.5;
    const speed = 40 + Math.random() * 80;
    particles.push({
      id: nextParticleId++,
      pos: { x, y },
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.4 + Math.random() * 0.4,
      maxLife: 0.4 + Math.random() * 0.4,
      color,
      size: 3 + Math.random() * 4,
      alive: true,
    });
  }
  return particles;
}

export function updateParticles(dt: number, particles: Particle[]): void {
  for (const p of particles) {
    if (!p.alive) continue;
    p.pos.x += p.vx * dt;
    p.pos.y += p.vy * dt;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life -= dt;
    if (p.life <= 0) p.alive = false;
  }
}

export function renderParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    if (!p.alive) continue;
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.pos.x - p.size / 2, p.pos.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}
