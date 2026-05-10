export type RealmLevel = 1 | 2 | 3 | 4 | 5;

export interface RealmConfig {
  level: RealmLevel;
  name: string;
  damageMultiplier: number;
  rangeBonus: number;
  attackSpeedBonus: number;
  cost: number;
}

export const REALMS: RealmConfig[] = [
  { level: 1, name: '炼气', damageMultiplier: 1.0, rangeBonus: 0, attackSpeedBonus: 0, cost: 0 },
  { level: 2, name: '筑基', damageMultiplier: 1.8, rangeBonus: 10, attackSpeedBonus: 0.1, cost: 150 },
  { level: 3, name: '金丹', damageMultiplier: 3.0, rangeBonus: 20, attackSpeedBonus: 0.25, cost: 300 },
  { level: 4, name: '元婴', damageMultiplier: 5.0, rangeBonus: 35, attackSpeedBonus: 0.4, cost: 500 },
  { level: 5, name: '化神', damageMultiplier: 8.0, rangeBonus: 50, attackSpeedBonus: 0.6, cost: 800 },
];

export const SELL_REFUND_RATIO = 0.5;
