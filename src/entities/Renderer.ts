import { Tower } from './Tower';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { Grid } from '../map/Grid';
import { REALMS } from '../config/upgrades';

const OUTLINE = 2.5;

// ── Tower rendering ──

export function renderTower(ctx: CanvasRenderingContext2D, tower: Tower, grid: Grid): void {
  const pos = grid.gridToPixel(tower.gridX, tower.gridY);
  const realm = REALMS[tower.level - 1];
  const size = 22 + tower.level * 4;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  // Main body — rounded square for cartoon feel
  ctx.fillStyle = tower.config.color;
  ctx.beginPath();
  drawRoundedSquare(ctx, pos.x, pos.y, size);
  ctx.fill();
  ctx.restore();

  // Thick cartoon outline
  ctx.strokeStyle = tower.config.outlineColor;
  ctx.lineWidth = OUTLINE;
  ctx.beginPath();
  drawRoundedSquare(ctx, pos.x, pos.y, size);
  ctx.stroke();

  // White highlight (top-left shine)
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(pos.x - size * 0.25, pos.y - size * 0.25, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Icon
  ctx.fillStyle = '#fff';
  ctx.font = `${16 + tower.level * 2}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 1;
  ctx.fillText(tower.config.icon, pos.x, pos.y);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Realm label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText(realm.name, pos.x, pos.y + size + 14);

  // Level stars
  const starY = pos.y - size - 8;
  for (let i = 0; i < tower.level; i++) {
    const sx = pos.x - (tower.level - 1) * 5 + i * 10;
    ctx.fillStyle = '#ffd700';
    ctx.font = '8px sans-serif';
    ctx.fillText('★', sx, starY);
  }
}

function drawRoundedSquare(ctx: CanvasRenderingContext2D, cx: number, cy: number, half: number): void {
  const r = half * 0.35;
  ctx.moveTo(cx - half + r, cy - half);
  ctx.lineTo(cx + half - r, cy - half);
  ctx.arcTo(cx + half, cy - half, cx + half, cy - half + r, r);
  ctx.lineTo(cx + half, cy + half - r);
  ctx.arcTo(cx + half, cy + half, cx + half - r, cy + half, r);
  ctx.lineTo(cx - half + r, cy + half);
  ctx.arcTo(cx - half, cy + half, cx - half, cy + half - r, r);
  ctx.lineTo(cx - half, cy - half + r);
  ctx.arcTo(cx - half, cy - half, cx - half + r, cy - half, r);
  ctx.closePath();
}

// ── Enemy rendering ──

export function renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  if (!enemy.alive) return;

  const { x, y } = enemy.pos;
  const s = enemy.config.size;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;

  // Body
  ctx.fillStyle = enemy.config.color;
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Thick outline
  ctx.strokeStyle = enemy.config.outlineColor;
  ctx.lineWidth = OUTLINE;
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.stroke();

  // White eye base
  const eyeY = y - s * 0.18;
  const eyeOff = s * 0.28;
  const eyeR = s * 0.22;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - eyeOff, eyeY, eyeR, 0, Math.PI * 2);
  ctx.arc(x + eyeOff, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  // Eye outline
  ctx.strokeStyle = enemy.config.outlineColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x - eyeOff, eyeY, eyeR, 0, Math.PI * 2);
  ctx.arc(x + eyeOff, eyeY, eyeR, 0, Math.PI * 2);
  ctx.stroke();

  // Pupils (big for cute look)
  const pupilR = eyeR * 0.55;
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(x - eyeOff, eyeY, pupilR, 0, Math.PI * 2);
  ctx.arc(x + eyeOff, eyeY, pupilR, 0, Math.PI * 2);
  ctx.fill();

  // Eye sparkle
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - eyeOff - pupilR * 0.3, eyeY - pupilR * 0.3, pupilR * 0.35, 0, Math.PI * 2);
  ctx.arc(x + eyeOff - pupilR * 0.3, eyeY - pupilR * 0.3, pupilR * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (cute curved smile)
  const mouthY = y + s * 0.18;
  ctx.strokeStyle = enemy.config.mouthColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, mouthY, s * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Cheek blush
  ctx.fillStyle = 'rgba(255,100,100,0.3)';
  ctx.beginPath();
  ctx.ellipse(x - s * 0.5, mouthY - 2, s * 0.13, s * 0.08, 0, 0, Math.PI * 2);
  ctx.ellipse(x + s * 0.5, mouthY - 2, s * 0.13, s * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Special features per type
  if (enemy.type === 'beast') {
    // Horns
    ctx.fillStyle = '#8d6e63';
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    drawHorn(ctx, x - s * 0.4, y - s * 0.8, s * 0.3, -0.3);
    drawHorn(ctx, x + s * 0.4, y - s * 0.8, s * 0.3, 0.3);
  } else if (enemy.type === 'demon') {
    // Angry eyebrows
    ctx.strokeStyle = '#2a0050';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.45, eyeY - eyeR - 5);
    ctx.lineTo(x - s * 0.1, eyeY - eyeR);
    ctx.moveTo(x + s * 0.45, eyeY - eyeR - 5);
    ctx.lineTo(x + s * 0.1, eyeY - eyeR);
    ctx.stroke();
  } else if (enemy.type === 'boss') {
    // Crown / horns + angry brows
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.35, y - s);
    ctx.lineTo(x - s * 0.15, y - s * 1.35);
    ctx.lineTo(x, y - s * 0.9);
    ctx.lineTo(x + s * 0.15, y - s * 1.35);
    ctx.lineTo(x + s * 0.35, y - s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Angry brows
    ctx.strokeStyle = '#4a0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.5, eyeY - eyeR - 4);
    ctx.lineTo(x - s * 0.05, eyeY - eyeR + 1);
    ctx.moveTo(x + s * 0.5, eyeY - eyeR - 4);
    ctx.lineTo(x + s * 0.05, eyeY - eyeR + 1);
    ctx.stroke();
  }

  // HP bar — cartoon style
  if (enemy.hp < enemy.maxHp) {
    const bw = s * 2.2;
    const bh = 5;
    const by = y - s - 14;
    // Background
    ctx.fillStyle = '#444';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, by, bw, bh, 2);
    ctx.fill();
    ctx.stroke();
    // Fill
    const ratio = enemy.hp / enemy.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#76ff03' : ratio > 0.25 ? '#ffeb3b' : '#ff1744';
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, by, bw * ratio, bh, 2);
    ctx.fill();
  }

  // Slow indicator
  if (enemy.slowFactor < 1) {
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(x, y, s + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawHorn(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, angle: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(s, -s * 1.5);
  ctx.lineTo(-s * 0.3, -s * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// ── Projectile rendering ──

export function renderProjectile(ctx: CanvasRenderingContext2D, proj: Projectile): void {
  if (!proj.alive) return;

  const colors: Record<string, { main: string; glow: string }> = {
    sword: { main: '#ff6d3a', glow: '#ffaa66' },
    array: { main: '#42a5f5', glow: '#90caf9' },
    alchemy: { main: '#66bb6a', glow: '#a5d6a7' },
    talisman: { main: '#e040fb', glow: '#ea80fc' },
  };

  const c = colors[proj.towerType] ?? { main: '#fff', glow: '#ccc' };

  // Outer glow
  ctx.fillStyle = c.glow + '60';
  ctx.beginPath();
  ctx.arc(proj.pos.x, proj.pos.y, 7, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.fillStyle = c.main;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(proj.pos.x, proj.pos.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Trail
  const trailX = proj.pos.x - (proj.pos.x * 0.02);
  const trailY = proj.pos.y;
  ctx.fillStyle = c.glow + '40';
  ctx.beginPath();
  ctx.arc(trailX - 3, trailY, 3.5, 0, Math.PI * 2);
  ctx.arc(trailX - 6, trailY, 2.5, 0, Math.PI * 2);
  ctx.fill();
}
