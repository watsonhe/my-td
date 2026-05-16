import { GRID_SIZE, GRID_COLS, GRID_ROWS } from '../utils/constants';
import { Grid, TileType } from './Grid';
import { Tower } from '../entities/Tower';

const TILE_COLORS: Record<TileType, string> = {
  0: '#8cc63f', // buildable — bright cartoon grass
  1: '#f5c842', // path — warm golden sand
  2: '#5d9a3f', // blocked — deeper grass
};

export class MapRenderer {
  private frameCount = 0;

  render(ctx: CanvasRenderingContext2D, grid: Grid, towers: Tower[]): void {
    this.frameCount++;

    // Sky gradient background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GRID_ROWS * GRID_SIZE);
    skyGrad.addColorStop(0, '#87ceeb');
    skyGrad.addColorStop(0.3, '#b8e6b8');
    skyGrad.addColorStop(1, '#7bc67e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, GRID_COLS * GRID_SIZE, GRID_ROWS * GRID_SIZE);

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const tile = grid.getTile(col, row);
        if (tile === null) continue;
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        // Tile fill
        ctx.fillStyle = TILE_COLORS[tile];
        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);

        // Cartoon thick outline
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

        // Grass texture on buildable tiles
        if (tile === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
          // Little grass tufts (decorative dots)
          if ((col + row) % 3 === 0) {
            ctx.fillStyle = '#9fd94f';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.3, y + GRID_SIZE * 0.4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.7, y + GRID_SIZE * 0.6, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Path decorative pebbles
        if (tile === 1) {
          if ((col + row * 3) % 4 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE * 0.4, y + GRID_SIZE * 0.5, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Blocked tile: rocks
        if (tile === 2) {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.fillRect(x + 6, y + 6, GRID_SIZE - 12, GRID_SIZE - 12);
          ctx.fillStyle = '#4a7a2f';
          ctx.beginPath();
          ctx.arc(x + GRID_SIZE * 0.5, y + GRID_SIZE * 0.5, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Subtle animated shimmer on buildable tiles
    const shimmerAlpha = 0.02 + Math.sin(this.frameCount * 0.03) * 0.01;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const tile = grid.getTile(col, row);
        if (tile === 0) {
          ctx.fillStyle = `rgba(255,255,255,${shimmerAlpha})`;
          ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }
    }

    // Tower range indicators
    for (const tower of towers) {
      const pos = grid.gridToPixel(tower.gridX, tower.gridY);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tower.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
