import { GRID_SIZE, GRID_COLS, GRID_ROWS } from '../utils/constants';
import { Grid, TileType } from './Grid';
import { Tower } from '../entities/Tower';

const TILE_COLORS: Record<TileType, string> = {
  0: '#3a5a3a', // buildable - dark grass
  1: '#8b7355', // path - brown
  2: '#2a3a2a', // blocked - darker grass
};

export class MapRenderer {
  render(ctx: CanvasRenderingContext2D, grid: Grid, towers: Tower[]): void {
    // Draw tiles
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const tile = grid.getTile(col, row);
        if (tile === null) continue;
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE;

        ctx.fillStyle = TILE_COLORS[tile];
        ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);

        // Grid lines
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);

        // Buildable tile highlight
        if (tile === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.fillRect(x + 4, y + 4, GRID_SIZE - 8, GRID_SIZE - 8);
        }
      }
    }

    // Draw tower range indicators and towers
    for (const tower of towers) {
      const pos = grid.gridToPixel(tower.gridX, tower.gridY);
      // Range circle (subtle)
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tower.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
