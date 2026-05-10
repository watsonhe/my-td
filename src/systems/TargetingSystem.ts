import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Grid } from '../map/Grid';
import { distance } from '../utils/math';

export class TargetingSystem {
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  update(towers: Tower[], enemies: Enemy[]): void {
    const aliveEnemies = enemies.filter(e => e.alive);

    for (const tower of towers) {
      const towerPos = this.grid.gridToPixel(tower.gridX, tower.gridY);

      // Check if current target is still valid
      if (tower.targetId !== null) {
        const current = aliveEnemies.find(e => e.id === tower.targetId);
        if (current && distance(towerPos, current.pos) <= tower.range) {
          continue; // target still valid
        }
      }

      // Find new target: closest to exit (highest waypointIndex)
      let best: Enemy | null = null;
      let bestDist = Infinity;

      for (const enemy of aliveEnemies) {
        const dist = distance(towerPos, enemy.pos);
        if (dist <= tower.range) {
          // Prioritize enemy furthest along the path
          if (
            !best ||
            enemy.waypointIndex > best.waypointIndex ||
            (enemy.waypointIndex === best.waypointIndex && dist < bestDist)
          ) {
            best = enemy;
            bestDist = dist;
          }
        }
      }

      tower.targetId = best ? best.id : null;
    }
  }
}
