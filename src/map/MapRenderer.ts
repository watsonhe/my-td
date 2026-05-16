import { GRID_SIZE, GRID_COLS, GRID_ROWS } from '../utils/constants';
import { Grid, TileType } from './Grid';
import { Tower } from '../entities/Tower';

// Dragon Ball Namek-inspired palette
const TILE_COLORS: Record<TileType, string> = {
  0: '#5ec75e', // buildable — Namek grass: bright turquoise-green
  1: '#e8d48b', // path — sandy earth trail
  2: '#3a8a3a', // blocked — darker grass
};

export class MapRenderer {
  private frameCount = 0;

  render(ctx: CanvasRenderingContext2D, grid: Grid, towers: Tower[]): void {
    this.frameCount++;

    // Namek sky gradient: greenish-teal to pale green
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GRID_ROWS * GRID_SIZE);
    skyGrad.addColorStop(0, '#5cbaad');
    skyGrad.addColorStop(0.5, '#8dd8c8');
    skyGrad.addColorStop(1, '#b0e8c0');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, GRID_COLS * GRID_SIZE, GRID_ROWS * GRID_SIZE);

    // Draw tiles
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const tile = grid.getTile(col, row);
        if (tile === null) continue;
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        // Tile fill
        ctx.fillStyle = TILE_COLORS[tile];
        ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

        // DB-style thick black outline on tiles
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

        // Buildable: Namek-style grass tufts + small rounded rocks
        if (tile === 0) {
          // Grass highlight
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          ctx.fillRect(x + 4, y + 4, GRID_SIZE - 8, GRID_SIZE - 8);

          // Namek-style small round rocks
          if ((col + row * 7) % 5 === 0) {
            ctx.fillStyle = '#7ed87e';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.25, y + GRID_SIZE * 0.3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
          if ((col + row * 3) % 7 === 0) {
            ctx.fillStyle = '#8fe08f';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.7, y + GRID_SIZE * 0.65, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Path: sandy with DB-style shading
        if (tile === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
          // Small pebble
          if ((col + row * 5) % 4 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.5, y + GRID_SIZE * 0.5, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Blocked: Namek rock formations
        if (tile === 2) {
          ctx.fillStyle = 'rgba(0,0,0,0.08)';
          ctx.fillRect(x + 4, y + 4, GRID_SIZE - 8, GRID_SIZE - 8);
          // Bumpy rock
          ctx.fillStyle = '#4a9a3a';
          ctx.beginPath();
          ctx.moveTo(x + 10, y + GRID_SIZE - 8);
          ctx.quadraticCurveTo(x + 15, y + 8, x + GRID_SIZE / 2, y + 6);
          ctx.quadraticCurveTo(x + GRID_SIZE - 5, y + 8, x + GRID_SIZE - 10, y + GRID_SIZE - 8);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    // DB-style speed lines on path edges (animated)
    const slAlpha = 0.03 + Math.sin(this.frameCount * 0.04) * 0.015;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (grid.getTile(col, row) === 1) {
          ctx.fillStyle = `rgba(255,255,255,${slAlpha})`;
          ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }
    }

    // Tower range indicators — DB ki-sensing style
    for (const tower of towers) {
      const pos = grid.gridToPixel(tower.gridX, tower.gridY);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tower.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = tower.config.glowColor + '40';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
