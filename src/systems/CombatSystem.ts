import { Tower } from '../entities/Tower';
import { Enemy, Debuff } from '../entities/Enemy';
import { Projectile, createProjectile } from '../entities/Projectile';
import { Particle, createParticle } from '../entities/Particle';
import { Grid } from '../map/Grid';
import { EventBus } from '../core/EventBus';
import { distance } from '../utils/math';

export class CombatSystem {
  private grid: Grid;
  private time = 0;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  update(dt: number, towers: Tower[], enemies: Enemy[], projectiles: Projectile[], particles: Particle[]): void {
    this.time += dt;

    // Tower attacks
    for (const tower of towers) {
      if (tower.targetId === null) continue;
      const target = enemies.find(e => e.id === tower.targetId && e.alive);
      if (!target) {
        tower.targetId = null;
        continue;
      }

      const attackInterval = 1 / tower.attackSpeed;
      if (this.time - tower.lastAttackTime < attackInterval) continue;
      tower.lastAttackTime = this.time;

      const towerPos = this.grid.gridToPixel(tower.gridX, tower.gridY);
      const splashRadius = tower.config.splashRadius ?? 0;

      if (tower.config.special === 'chain' || tower.config.special === 'single') {
        const proj = createProjectile(tower.type, towerPos.x, towerPos.y, target.id, tower.damage, splashRadius);
        projectiles.push(proj);
      } else if (tower.config.special === 'dot') {
        const proj = createProjectile(
          tower.type, towerPos.x, towerPos.y, target.id, tower.damage, splashRadius,
          tower.config.dotDamage ?? 0, tower.config.dotDuration ?? 0,
        );
        projectiles.push(proj);
      } else {
        // splash
        const proj = createProjectile(tower.type, towerPos.x, towerPos.y, target.id, tower.damage, splashRadius);
        projectiles.push(proj);
      }
    }

    // Move projectiles
    for (const proj of projectiles) {
      if (!proj.alive) continue;

      const target = enemies.find(e => e.id === proj.targetId && e.alive);
      if (!target) {
        proj.alive = false;
        continue;
      }

      const dist = distance(proj.pos, target.pos);
      const moveAmount = proj.speed * dt;

      if (dist <= moveAmount + 5) {
        // Hit
        proj.alive = false;
        this.applyDamage(proj, target, enemies, particles);
      } else {
        const ratio = moveAmount / dist;
        proj.pos.x += (target.pos.x - proj.pos.x) * ratio;
        proj.pos.y += (target.pos.y - proj.pos.y) * ratio;
      }
    }
  }

  private applyDamage(proj: Projectile, target: Enemy, enemies: Enemy[], particles: Particle[]): void {
    // Splash damage
    if (proj.splashRadius > 0) {
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        if (distance(target.pos, enemy.pos) <= proj.splashRadius) {
          this.dealDamage(enemy, proj.damage, proj.towerType, particles);
        }
      }
    } else if (proj.towerType === 'talisman') {
      // Chain: hit primary, then bounce to nearby
      this.dealDamage(target, proj.damage, proj.towerType, particles);
      const chainCount = 3;
      let lastTarget = target;
      for (let i = 0; i < chainCount - 1; i++) {
        const next = enemies.find(
          e => e.alive && e.id !== lastTarget.id && distance(lastTarget.pos, e.pos) < 120,
        );
        if (!next) break;
        this.dealDamage(next, proj.damage * 0.6, proj.towerType, particles);
        lastTarget = next;
      }
    } else if (proj.towerType === 'alchemy') {
      // Apply DOT debuff from projectile config
      if (proj.dotDamage > 0 && proj.dotDuration > 0) {
        const dot: Debuff = {
          type: 'dot',
          damagePerSecond: proj.dotDamage,
          remaining: proj.dotDuration,
        };
        target.debuffs.push(dot);
      }
      this.dealDamage(target, proj.damage, proj.towerType, particles);
    } else {
      // Normal single target
      this.dealDamage(target, proj.damage, proj.towerType, particles);
    }
  }

  private dealDamage(enemy: Enemy, damage: number, towerType: string, particles: Particle[]): void {
    enemy.hp -= damage;
    // Hit particles
    const newP = createParticle(enemy.pos.x, enemy.pos.y, '#fff', 3);
    particles.push(...newP);

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
      // Death particles
      const deathP = createParticle(enemy.pos.x, enemy.pos.y, enemy.config.color, 12);
      particles.push(...deathP);
      EventBus.emit('enemy:killed', enemy);
    }
  }

  updateDebuffs(dt: number, enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      for (let i = enemy.debuffs.length - 1; i >= 0; i--) {
        const debuff = enemy.debuffs[i];
        if (debuff.type === 'dot') {
          enemy.hp -= debuff.damagePerSecond * dt;
        }
        debuff.remaining -= dt;
        if (debuff.remaining <= 0) {
          enemy.debuffs.splice(i, 1);
        }
      }
      // Check DOT death
      if (enemy.hp <= 0 && enemy.alive) {
        enemy.hp = 0;
        enemy.alive = false;
        const deathP = createParticle(enemy.pos.x, enemy.pos.y, enemy.config.color, 8);
        EventBus.emit('enemy:killed', enemy);
      }
    }
  }
}
