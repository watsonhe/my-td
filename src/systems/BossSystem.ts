import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Particle, createParticle } from '../entities/Particle';
import { Grid } from '../map/Grid';
import { EventBus } from '../core/EventBus';
import { distance } from '../utils/math';

export class BossSystem {
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  update(dt: number, enemies: Enemy[], towers: Tower[], particles: Particle[]): void {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      // Only enemies with tower-destroying capability (bosses)
      if (!enemy.config.attackDamage || !enemy.config.attackRange) continue;

      const attackCd = enemy.config.attackCooldown ?? 2;
      const attackRange = enemy.config.attackRange!;

      // Tick cooldown
      if (enemy.attackCooldownRemaining > 0) {
        enemy.attackCooldownRemaining -= dt;
      }

      // If currently attacking, wait for cooldown to expire, then resume
      if (enemy.isAttacking) {
        enemy.speed = 0; // freeze in place
        if (enemy.attackCooldownRemaining <= 0) {
          enemy.isAttacking = false;
          enemy.attackTargetId = null;
          enemy.speed = enemy.baseSpeed * enemy.slowFactor;
        }
        continue;
      }

      // Can we attack now?
      if (enemy.attackCooldownRemaining > 0) continue;

      // Find nearest alive tower within attack range
      let closest: Tower | null = null;
      let minDist = Infinity;

      for (const tower of towers) {
        if (!tower.alive) continue;
        const towerPos = this.grid.gridToPixel(tower.gridX, tower.gridY);
        const d = distance(enemy.pos, towerPos);
        if (d <= attackRange && d < minDist) {
          closest = tower;
          minDist = d;
        }
      }

      if (!closest) continue;

      // Attack the tower
      const tower = closest;
      const towerPos = this.grid.gridToPixel(tower.gridX, tower.gridY);

      // Set attacking state — boss stops moving
      enemy.isAttacking = true;
      enemy.attackTargetId = tower.id;
      enemy.speed = 0;
      enemy.attackCooldownRemaining = attackCd;

      // Deal damage
      const dmg = enemy.config.attackDamage!;
      tower.hp -= dmg;
      tower.damageFlashTimer = 0.3;

      // Red hit particles at tower position
      const hitP = createParticle(towerPos.x, towerPos.y, '#ff1744', 6);
      particles.push(...hitP);

      // Emit tower damaged event
      EventBus.emit('tower:damaged', { tower, damage: dmg, attacker: enemy });

      // Check if tower destroyed
      if (tower.hp <= 0) {
        tower.hp = 0;
        tower.alive = false;
        // Large death burst
        const deathP = createParticle(towerPos.x, towerPos.y, '#ff5252', 18);
        particles.push(...deathP);
        EventBus.emit('tower:destroyed', tower);
      }
    }
  }
}
