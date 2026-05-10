export type TowerType = 'sword' | 'array' | 'alchemy' | 'talisman';

export interface TowerConfig {
  type: TowerType;
  name: string;
  description: string;
  baseDamage: number;
  baseRange: number;
  baseAttackSpeed: number;   // attacks per second
  buildCost: number;
  color: string;
  icon: string;              // text character for rendering
  special: 'single' | 'splash' | 'dot' | 'chain';
  splashRadius?: number;
  dotDamage?: number;
  dotDuration?: number;
  chainCount?: number;
}

export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  sword: {
    type: 'sword',
    name: '剑修',
    description: '单体高伤',
    baseDamage: 30,
    baseRange: 120,
    baseAttackSpeed: 1.0,
    buildCost: 100,
    color: '#f0c040',
    icon: '⚔',
    special: 'single',
  },
  array: {
    type: 'array',
    name: '阵修',
    description: '范围溅射',
    baseDamage: 18,
    baseRange: 100,
    baseAttackSpeed: 0.8,
    buildCost: 120,
    color: '#60c0f0',
    icon: '◎',
    special: 'splash',
    splashRadius: 60,
  },
  alchemy: {
    type: 'alchemy',
    name: '丹修',
    description: '毒伤减速',
    baseDamage: 12,
    baseRange: 110,
    baseAttackSpeed: 0.7,
    buildCost: 80,
    color: '#90d040',
    icon: '☯',
    special: 'dot',
    dotDamage: 8,
    dotDuration: 3,
  },
  talisman: {
    type: 'talisman',
    name: '符修',
    description: '连锁弹射',
    baseDamage: 20,
    baseRange: 130,
    baseAttackSpeed: 0.9,
    buildCost: 110,
    color: '#e080e0',
    icon: '㊯',
    special: 'chain',
    chainCount: 3,
  },
};
