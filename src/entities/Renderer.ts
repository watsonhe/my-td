import { Tower } from './Tower';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { Grid } from '../map/Grid';
import { REALMS } from '../config/upgrades';

const OUTLINE = 3; // Dragon Ball = thick outlines
const SHADOW_COLOR = 'rgba(0,0,0,0.35)';

// ═══════════════════════════════════════════
//  DRAGON BALL STYLE TOWER RENDERING
//  Martial artists with ki auras
// ═══════════════════════════════════════════

export function renderTower(ctx: CanvasRenderingContext2D, tower: Tower, grid: Grid): void {
  if (!tower.alive) return;

  const pos = grid.gridToPixel(tower.gridX, tower.gridY);
  const realm = REALMS[tower.level - 1];
  const size = 20 + tower.level * 4;

  // Ki aura glow (higher levels = bigger aura)
  if (tower.level >= 2) {
    const auraGrad = ctx.createRadialGradient(pos.x, pos.y, size * 0.5, pos.x, pos.y, size + 12);
    auraGrad.addColorStop(0, tower.config.glowColor + '50');
    auraGrad.addColorStop(1, tower.config.glowColor + '00');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size + 12, 0, Math.PI * 2);
    ctx.fill();

    // Ki aura spikes (DB-style spiky aura)
    ctx.strokeStyle = tower.config.glowColor + '40';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + (tower.id * 0.3);
      const innerR = size + 4;
      const outerR = size + 8 + Math.sin(Date.now() * 0.003 + i) * 4;
      ctx.beginPath();
      ctx.moveTo(pos.x + Math.cos(angle) * innerR, pos.y + Math.sin(angle) * innerR);
      ctx.lineTo(pos.x + Math.cos(angle) * outerR, pos.y + Math.sin(angle) * outerR);
      ctx.stroke();
    }
  }

  // Drop shadow
  ctx.save();
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  // Body — DB style: hexagonal/angular shape
  ctx.fillStyle = tower.config.color;
  ctx.beginPath();
  drawDBShape(ctx, pos.x, pos.y, size);
  ctx.fill();
  ctx.restore();

  // Thick DB outline
  ctx.strokeStyle = tower.config.outlineColor;
  ctx.lineWidth = OUTLINE;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  drawDBShape(ctx, pos.x, pos.y, size);
  ctx.stroke();

  // Inner lighter area (gi fold / muscle definition)
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.arc(pos.x - size * 0.15, pos.y - size * 0.2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Belt line (DB gi belt)
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pos.x - size * 0.7, pos.y + size * 0.15);
  ctx.lineTo(pos.x + size * 0.7, pos.y + size * 0.15);
  ctx.stroke();

  // Icon (held above/in front)
  ctx.fillStyle = '#fff';
  ctx.font = `${15 + tower.level * 2}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tower.config.icon, pos.x, pos.y - 2);

  // Damage flash overlay
  if (tower.damageFlashTimer > 0) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.35)';
    ctx.beginPath();
    drawDBShape(ctx, pos.x, pos.y, size);
    ctx.fill();
  }

  // Realm name below
  ctx.fillStyle = '#ffd740';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(realm.name, pos.x, pos.y + size + 13);

  // Tower HP bar (only when damaged)
  if (tower.hp < tower.maxHp) {
    const bw = 40;
    const bh = 3;
    const by = pos.y + size + 23;
    // BG
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pos.x - bw / 2, by, bw, bh, 2);
    ctx.fill();
    ctx.stroke();
    // Fill
    const ratio = tower.hp / tower.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#76ff03' : ratio > 0.25 ? '#ffd600' : '#ff1744';
    ctx.beginPath();
    ctx.roundRect(pos.x - bw / 2, by, bw * ratio, bh, 2);
    ctx.fill();
  }

  // Level stars (DB power level stars)
  const starY = pos.y - size - 10;
  for (let i = 0; i < tower.level; i++) {
    const sx = pos.x - (tower.level - 1) * 6 + i * 12;
    drawDBStar(ctx, sx, starY, 5);
  }
}

// DB-style angular hexagonal shape
function drawDBShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  const sides = 6;
  const angleOffset = -Math.PI / 2;
  ctx.moveTo(cx + r * Math.cos(angleOffset), cy + r * Math.sin(angleOffset));
  for (let i = 1; i < sides; i++) {
    const angle = angleOffset + (Math.PI * 2 * i) / sides;
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  ctx.closePath();
}

function drawDBStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#cc8800';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = -Math.PI / 2 + (Math.PI * 2 * i) / 5;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = cx + Math.cos(outerAngle) * r;
    const oy = cy + Math.sin(outerAngle) * r;
    const ix = cx + Math.cos(innerAngle) * r * 0.4;
    const iy = cy + Math.sin(innerAngle) * r * 0.4;
    if (i === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// ═══════════════════════════════════════════
//  DRAGON BALL STYLE ENEMY RENDERING
//  Saibaiman / Freeza soldiers / Majin Buu
// ═══════════════════════════════════════════

export function renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  if (!enemy.alive) return;

  const { x, y } = enemy.pos;
  const s = enemy.config.size;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = SHADOW_COLOR;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 4;

  // Body — round with DB angular feel
  ctx.fillStyle = enemy.config.color;
  ctx.beginPath();
  drawDBEnemyBody(ctx, x, y, s, enemy.type);
  ctx.fill();
  ctx.restore();

  // THICK DB outline
  ctx.strokeStyle = enemy.config.outlineColor;
  ctx.lineWidth = OUTLINE;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  drawDBEnemyBody(ctx, x, y, s, enemy.type);
  ctx.stroke();

  // ── Face (DB style: sharp, expressive) ──
  const eyeY = y - s * 0.12;
  const eyeOff = s * 0.3;
  const eyeR = s * 0.22;

  // Eye whites
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = enemy.config.outlineColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x - eyeOff, eyeY, eyeR, eyeR * 1.25, 0, 0, Math.PI * 2);
  ctx.ellipse(x + eyeOff, eyeY, eyeR, eyeR * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupils (DB style: black with white spark)
  const pupilR = eyeR * 0.55;
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x - eyeOff, eyeY, pupilR, 0, Math.PI * 2);
  ctx.arc(x + eyeOff, eyeY, pupilR, 0, Math.PI * 2);
  ctx.fill();

  // Spark
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - eyeOff - pupilR * 0.35, eyeY - pupilR * 0.35, pupilR * 0.3, 0, Math.PI * 2);
  ctx.arc(x + eyeOff - pupilR * 0.35, eyeY - pupilR * 0.35, pupilR * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Per-type features ──
  if (enemy.type === 'imp') {
    // Saibaiman style: spiky head, red spots, evil grin
    drawSpikyHead(ctx, x, y - s, s * 0.7, s * 0.9, enemy.config.outlineColor, enemy.config.color);
    // Red dots on cheeks
    ctx.fillStyle = enemy.config.accentColor;
    ctx.beginPath();
    ctx.arc(x - s * 0.5, y + s * 0.05, s * 0.12, 0, Math.PI * 2);
    ctx.arc(x + s * 0.5, y + s * 0.05, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Evil grin
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(x, y + s * 0.22, s * 0.18, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

  } else if (enemy.type === 'beast') {
    // DB dinosaur style: horns, wide mouth
    drawDBHorn(ctx, x - s * 0.45, y - s * 0.85, s * 0.28, -0.4);
    drawDBHorn(ctx, x + s * 0.45, y - s * 0.85, s * 0.28, 0.4);
    // Wide angry mouth
    ctx.fillStyle = '#5a1800';
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y + s * 0.3, s * 0.25, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Belly patch
    ctx.fillStyle = enemy.config.accentColor;
    ctx.beginPath();
    ctx.ellipse(x, y + s * 0.5, s * 0.5, s * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

  } else if (enemy.type === 'demon') {
    // Freeza soldier: scouter, armored look, angry
    drawSpikyHead(ctx, x, y - s, s * 0.65, s * 0.85, enemy.config.outlineColor, enemy.config.color);
    // Scouter (red lens)
    ctx.fillStyle = enemy.config.accentColor;
    ctx.beginPath();
    ctx.arc(x - s * 0.55, eyeY + 4, eyeR * 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Angry eyebrows
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.55, eyeY - eyeR - 5);
    ctx.lineTo(x - s * 0.05, eyeY - eyeR + 2);
    ctx.moveTo(x + s * 0.55, eyeY - eyeR - 5);
    ctx.lineTo(x + s * 0.05, eyeY - eyeR + 2);
    ctx.stroke();
    // Angry mouth
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + s * 0.3, s * 0.18, 1.15 * Math.PI, 1.85 * Math.PI);
    ctx.stroke();

  } else if (enemy.type === 'boss') {
    // Majin Buu style: antenna, round, cape
    // Head antenna
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.95);
    ctx.quadraticCurveTo(x + s * 0.2, y - s * 1.5, x + s * 0.4, y - s * 1.4);
    ctx.stroke();
    // Cape
    ctx.fillStyle = enemy.config.accentColor + '50'; // golden cape
    ctx.beginPath();
    ctx.moveTo(x - s * 0.6, y - s * 0.3);
    ctx.quadraticCurveTo(x - s * 1.2, y + s * 0.5, x - s * 0.8, y + s * 1.2);
    ctx.lineTo(x + s * 0.3, y + s * 1.0);
    ctx.quadraticCurveTo(x - s * 0.2, y + s * 0.3, x + s * 0.4, y - s * 0.3);
    ctx.fill();
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Angry DB brows
    ctx.strokeStyle = enemy.config.outlineColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.5, eyeY - eyeR - 5);
    ctx.lineTo(x - s * 0.03, eyeY - eyeR + 2);
    ctx.moveTo(x + s * 0.5, eyeY - eyeR - 5);
    ctx.lineTo(x + s * 0.03, eyeY - eyeR + 2);
    ctx.stroke();
    // Evil grin
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.fillStyle = '#3a0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + s * 0.15, s * 0.22, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.lineTo(x, y + s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tower-destroying attack aura
    if (enemy.isAttacking) {
      const auraGrad = ctx.createRadialGradient(x, y, s * 0.4, x, y, s * 1.6);
      auraGrad.addColorStop(0, 'rgba(255, 40, 40, 0.5)');
      auraGrad.addColorStop(1, 'rgba(255, 40, 40, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, y, s * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Rotating energy sparks
      ctx.strokeStyle = 'rgba(255, 80, 80, 0.7)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 + performance.now() * 0.006;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * s * 0.9, y + Math.sin(angle) * s * 0.9);
        ctx.lineTo(x + Math.cos(angle) * (s * 0.9 + 14), y + Math.sin(angle) * (s * 0.9 + 14));
        ctx.stroke();
      }
    }
  }

  // HP bar (DB scouter-style)
  if (enemy.hp < enemy.maxHp) {
    const bw = s * 2.3;
    const bh = 4;
    const by = y - s - 16;
    // BG
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, by, bw, bh, 2);
    ctx.fill();
    ctx.stroke();
    // Fill
    const ratio = enemy.hp / enemy.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#76ff03' : ratio > 0.25 ? '#ffd600' : '#ff1744';
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, by, bw * ratio, bh, 2);
    ctx.fill();
  }

  // Slow debuff indicator
  if (enemy.slowFactor < 1) {
    ctx.strokeStyle = '#76ff03';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(x, y, s + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// DB-style spiky head
function drawSpikyHead(ctx: CanvasRenderingContext2D, cx: number, topY: number, w: number, h: number, outline: string, fill: string): void {
  ctx.fillStyle = fill;
  ctx.strokeStyle = outline;
  ctx.lineWidth = OUTLINE;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - w, topY + h);
  // Spikes across the top
  const spikes = 5;
  for (let i = 0; i < spikes; i++) {
    const sx = cx - w + (w * 2 * (i + 0.5)) / spikes;
    const spikeH = h - (i % 2 === 0 ? h * 0.3 : 0);
    ctx.lineTo(sx, topY + h - spikeH);
    ctx.lineTo(cx - w + (w * 2 * (i + 1)) / spikes, topY + h);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawDBHorn(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, angle: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#d4a76a';
  ctx.strokeStyle = '#5d3a1a';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.25, 0);
  ctx.quadraticCurveTo(0, -s * 1.2, s * 0.5, -s * 1.6);
  ctx.quadraticCurveTo(s * 0.4, -s * 0.8, s * 0.1, -s * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// DB-style body shape (slightly angular, not perfectly round)
function drawDBEnemyBody(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, type: string): void {
  const angleOff = -Math.PI / 2;
  const points = 8;
  const jitter = type === 'boss' ? 0.12 : type === 'demon' ? 0.08 : 0.05;

  ctx.moveTo(cx + r * Math.cos(angleOff), cy + r * Math.sin(angleOff));
  for (let i = 1; i < points; i++) {
    const angle = angleOff + (Math.PI * 2 * i) / points;
    const jr = r * (1 + Math.sin(i * 3) * jitter);
    ctx.lineTo(cx + jr * Math.cos(angle), cy + jr * Math.sin(angle));
  }
  ctx.closePath();
}

// ═══════════════════════════════════════════
//  DRAGON BALL STYLE PROJECTILES — KI BLASTS
// ═══════════════════════════════════════════

export function renderProjectile(ctx: CanvasRenderingContext2D, proj: Projectile): void {
  if (!proj.alive) return;

  const colors: Record<string, { main: string; glow: string; core: string }> = {
    sword: { main: '#ffcc00', glow: '#ff8800', core: '#fff' },
    array: { main: '#64b5f6', glow: '#2196f3', core: '#fff' },
    alchemy: { main: '#81c784', glow: '#4caf50', core: '#fff' },
    talisman: { main: '#ea80fc', glow: '#c241d0', core: '#fff' },
  };

  const c = colors[proj.towerType] ?? { main: '#ff0', glow: '#f80', core: '#fff' };
  const { x, y } = proj.pos;

  // Outer ki aura glow (big, soft)
  const auraGrad = ctx.createRadialGradient(x, y, 2, x, y, 10);
  auraGrad.addColorStop(0, c.glow + '80');
  auraGrad.addColorStop(1, c.glow + '00');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  // DB-style speed lines around ki blast
  ctx.strokeStyle = c.main + '40';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4 + performance.now() * 0.01;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * 7, y + Math.sin(angle) * 7);
    ctx.lineTo(x + Math.cos(angle) * 14, y + Math.sin(angle) * 14);
    ctx.stroke();
  }

  // Main ki ball
  ctx.fillStyle = c.main;
  ctx.strokeStyle = c.glow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Bright core
  ctx.fillStyle = c.core;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Motion trail
  const trailOff = 8;
  ctx.fillStyle = c.main + '40';
  ctx.beginPath();
  ctx.arc(x - trailOff * 0.4, y, 3, 0, Math.PI * 2);
  ctx.arc(x - trailOff * 0.8, y, 2, 0, Math.PI * 2);
  ctx.fill();
}
