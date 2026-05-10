import { Tower } from './Tower';
import { Enemy } from './Enemy';
import { Projectile } from './Projectile';
import { Grid } from '../map/Grid';
import { REALMS } from '../config/upgrades';

export function renderTower(ctx: CanvasRenderingContext2D, tower: Tower, grid: Grid): void {
  const pos = grid.gridToPixel(tower.gridX, tower.gridY);
  const realm = REALMS[tower.level - 1];
  const size = 20 + tower.level * 4;

  // Base glow (higher levels have larger glow)
  if (tower.level >= 2) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size + 6, 0, Math.PI * 2);
    ctx.fillStyle = tower.config.color + '30';
    ctx.fill();
  }

  // Tower body
  ctx.fillStyle = tower.config.color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Icon
  ctx.fillStyle = '#fff';
  ctx.font = `${14 + tower.level * 2}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tower.config.icon, pos.x, pos.y);

  // Realm label below
  ctx.fillStyle = '#f0e0c0';
  ctx.font = '10px sans-serif';
  ctx.fillText(realm.name, pos.x, pos.y + size + 12);
}

export function renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  if (!enemy.alive) return;

  const { x, y } = enemy.pos;
  const size = enemy.config.size;

  // Body
  ctx.fillStyle = enemy.config.color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Face (cute style: simple eyes + mouth)
  ctx.fillStyle = '#fff';
  // Eyes
  const eyeOffset = size * 0.3;
  const eyeSize = size * 0.2;
  ctx.beginPath();
  ctx.arc(x - eyeOffset, y - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
  ctx.arc(x + eyeOffset, y - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(x - eyeOffset, y - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
  ctx.arc(x + eyeOffset, y - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // HP bar
  if (enemy.hp < enemy.maxHp) {
    const barWidth = size * 2;
    const barHeight = 4;
    const barY = y - size - 10;
    ctx.fillStyle = '#333';
    ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);
    ctx.fillStyle = enemy.hp / enemy.maxHp > 0.5 ? '#4f4' : '#f44';
    ctx.fillRect(x - barWidth / 2, barY, barWidth * (enemy.hp / enemy.maxHp), barHeight);
  }

  // Slow indicator
  if (enemy.slowFactor < 1) {
    ctx.strokeStyle = '#6f6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, size + 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function renderProjectile(ctx: CanvasRenderingContext2D, proj: Projectile): void {
  if (!proj.alive) return;

  const colors: Record<string, string> = {
    sword: '#f0c040',
    array: '#60c0f0',
    alchemy: '#90d040',
    talisman: '#e080e0',
  };

  ctx.fillStyle = colors[proj.towerType] ?? '#fff';
  ctx.beginPath();
  ctx.arc(proj.pos.x, proj.pos.y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Trail
  ctx.fillStyle = (colors[proj.towerType] ?? '#fff') + '40';
  ctx.beginPath();
  ctx.arc(proj.pos.x - 4, proj.pos.y - 1, 3, 0, Math.PI * 2);
  ctx.fill();
}
