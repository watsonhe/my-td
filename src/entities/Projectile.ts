import { TowerType } from '../config/towers';

export interface Projectile {
  id: number;
  towerType: TowerType;
  pos: { x: number; y: number };
  targetId: number;
  damage: number;
  speed: number;
  splashRadius: number;
  dotDamage: number;
  dotDuration: number;
  alive: boolean;
}

let nextProjId = 1;

export function createProjectile(
  towerType: TowerType,
  x: number,
  y: number,
  targetId: number,
  damage: number,
  splashRadius: number,
  dotDamage = 0,
  dotDuration = 0,
): Projectile {
  return {
    id: nextProjId++,
    towerType,
    pos: { x, y },
    targetId,
    damage,
    speed: 300,
    splashRadius,
    dotDamage,
    dotDuration,
    alive: true,
  };
}
