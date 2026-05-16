export type TowerType = 'sword' | 'array' | 'alchemy' | 'talisman';

export interface TowerConfig {
  type: TowerType;
  name: string;
  description: string;
  baseDamage: number;
  baseRange: number;
  baseAttackSpeed: number;
  buildCost: number;
  color: string;
  outlineColor: string;
  glowColor: string;
  icon: string;
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
    color: '#ff6d3a',
    outlineColor: '#c43a00',
    glowColor: '#ffaa66',
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
    color: '#42a5f5',
    outlineColor: '#1565c0',
    glowColor: '#90caf9',
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
    color: '#66bb6a',
    outlineColor: '#2e7d32',
    glowColor: '#a5d6a7',
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
    color: '#e040fb',
    outlineColor: '#9c27b0',
    glowColor: '#ea80fc',
    icon: '㊯',
    special: 'chain',
    chainCount: 3,
  },
};
