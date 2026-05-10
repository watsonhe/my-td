import { EnemyType, EnemyConfig, ENEMY_CONFIGS } from '../config/enemies';

export interface Debuff {
  type: 'dot';
  damagePerSecond: number;
  remaining: number; // seconds
}

export interface Enemy {
  id: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;
  reward: number;
  damage: number;
  pos: { x: number; y: number };
  waypointIndex: number;
  debuffs: Debuff[];
  alive: boolean;
  config: EnemyConfig;
  slowFactor: number; // 1.0 = normal, 0.5 = half speed
}

let nextEnemyId = 1;

export function createEnemy(type: EnemyType, startX: number, startY: number): Enemy {
  const config = ENEMY_CONFIGS[type];
  return {
    id: nextEnemyId++,
    type,
    hp: config.hp,
    maxHp: config.hp,
    speed: config.speed,
    baseSpeed: config.speed,
    reward: config.reward,
    damage: config.damage,
    pos: { x: startX, y: startY },
    waypointIndex: 1, // start heading to first real waypoint
    debuffs: [],
    alive: true,
    config,
    slowFactor: 1.0,
  };
}
