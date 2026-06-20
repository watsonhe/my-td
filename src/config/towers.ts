export type TowerType = 'sword' | 'array' | 'alchemy' | 'talisman';

export interface TowerConfig {
  type: TowerType;
  name: string;
  description: string;
  baseDamage: number;
  baseRange: number;
  baseAttackSpeed: number;
  buildCost: number;
  color: string;        // main gi/skin color
  outlineColor: string; // thick DB outline
  glowColor: string;    // ki aura color
  icon: string;
  hp: number;
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
    color: '#f0833a',        // Goku orange gi
    outlineColor: '#8b2a0a',
    glowColor: '#ffd740',
    icon: '⚔',
    hp: 200,
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
    color: '#2363a3',        // deep blue gi
    outlineColor: '#0a2a5a',
    glowColor: '#64b5f6',
    icon: '◎',
    hp: 180,
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
    color: '#4caf50',        // green, nature
    outlineColor: '#1b5e20',
    glowColor: '#81c784',
    icon: '☯',
    hp: 150,
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
    color: '#c241d0',        // mystic purple
    outlineColor: '#6a1b7a',
    glowColor: '#ea80fc',
    icon: '㊯',
    hp: 170,
    special: 'chain',
    chainCount: 3,
  },
};
