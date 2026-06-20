import { TowerType, TowerConfig, TOWER_CONFIGS } from '../config/towers';
import { RealmLevel } from '../config/upgrades';

export interface Tower {
  id: number;
  type: TowerType;
  gridX: number;
  gridY: number;
  level: RealmLevel;
  damage: number;
  range: number;
  attackSpeed: number;
  lastAttackTime: number;
  targetId: number | null;
  config: TowerConfig;
  totalInvested: number; // total spirit spent (build + upgrades)
  hp: number;
  maxHp: number;
  alive: boolean;
  damageFlashTimer: number; // seconds remaining for red flash effect
}

let nextTowerId = 1;

export function createTower(type: TowerType, gridX: number, gridY: number): Tower {
  const config = TOWER_CONFIGS[type];
  return {
    id: nextTowerId++,
    type,
    gridX,
    gridY,
    level: 1,
    damage: config.baseDamage,
    range: config.baseRange,
    attackSpeed: config.baseAttackSpeed,
    lastAttackTime: 0,
    targetId: null,
    config,
    totalInvested: config.buildCost,
    hp: config.hp,
    maxHp: config.hp,
    alive: true,
    damageFlashTimer: 0,
  };
}
