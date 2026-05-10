import { Enemy } from '../entities/Enemy';
import { EventBus } from '../core/EventBus';
import { Grid } from '../map/Grid';
import { distance } from '../utils/math';

export class PathSystem {
  private waypoints: { x: number; y: number }[];
  private grid: Grid;

  constructor(waypoints: { x: number; y: number }[], grid: Grid) {
    this.waypoints = waypoints;
    this.grid = grid;
  }

  update(dt: number, enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Apply slow from debuffs
      const hasSlow = enemy.debuffs.length > 0;
      enemy.slowFactor = hasSlow ? 0.5 : 1.0;
      enemy.speed = enemy.baseSpeed * enemy.slowFactor;

      // Move toward current waypoint
      if (enemy.waypointIndex >= this.waypoints.length) {
        // Reached the end
        enemy.alive = false;
        EventBus.emit('enemy:reached_end', enemy);
        continue;
      }

      const target = this.grid.gridToPixel(
        this.waypoints[enemy.waypointIndex].x,
        this.waypoints[enemy.waypointIndex].y
      );

      const dist = distance(enemy.pos, target);
      const moveAmount = enemy.speed * dt;

      if (dist <= moveAmount) {
        // Snap to waypoint and advance
        enemy.pos.x = target.x;
        enemy.pos.y = target.y;
        enemy.waypointIndex++;
        // Check if reached final waypoint
        if (enemy.waypointIndex >= this.waypoints.length) {
          enemy.alive = false;
          EventBus.emit('enemy:reached_end', enemy);
        }
      } else {
        // Move toward waypoint
        const dx = target.x - enemy.pos.x;
        const dy = target.y - enemy.pos.y;
        const ratio = moveAmount / dist;
        enemy.pos.x += dx * ratio;
        enemy.pos.y += dy * ratio;
      }
    }
  }
}
