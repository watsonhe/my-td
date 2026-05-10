import { GRID_SIZE, GRID_COLS, GRID_ROWS } from '../utils/constants';

export type TileType = 0 | 1 | 2; // 0=buildable, 1=path, 2=blocked

export class Grid {
  tiles: TileType[][];

  constructor(data: number[][]) {
    this.tiles = data as TileType[][];
  }

  getTile(col: number, row: number): TileType | null {
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return null;
    return this.tiles[row][col];
  }

  isBuildable(col: number, row: number): boolean {
    return this.getTile(col, row) === 0;
  }

  hasTower(_col: number, _row: number): boolean {
    return false; // checked against GameState in GameScene
  }

  pixelToGrid(x: number, y: number): { col: number; row: number } {
    return {
      col: Math.floor(x / GRID_SIZE),
      row: Math.floor(y / GRID_SIZE),
    };
  }

  gridToPixel(col: number, row: number): { x: number; y: number } {
    return {
      x: col * GRID_SIZE + GRID_SIZE / 2,
      y: row * GRID_SIZE + GRID_SIZE / 2,
    };
  }
}
