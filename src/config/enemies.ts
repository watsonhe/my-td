export type EnemyType = 'imp' | 'beast' | 'demon' | 'boss';

export const ENEMY_LABELS: Record<EnemyType, string> = {
  imp: '小妖',
  beast: '妖兽',
  demon: '魔物',
  boss: '妖王',
};

export interface EnemyConfig {
  type: EnemyType;
  hp: number;
  speed: number;        // pixels per second
  reward: number;       // spirit gained on kill
  damage: number;       // lives lost when reaching end
  color: string;
  size: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  imp: {
    type: 'imp',
    hp: 60,
    speed: 60,
    reward: 15,
    damage: 1,
    color: '#e06060',
    size: 24,
  },
  beast: {
    type: 'beast',
    hp: 150,
    speed: 45,
    reward: 30,
    damage: 2,
    color: '#d08040',
    size: 30,
  },
  demon: {
    type: 'demon',
    hp: 350,
    speed: 35,
    reward: 60,
    damage: 3,
    color: '#8040c0',
    size: 34,
  },
  boss: {
    type: 'boss',
    hp: 1200,
    speed: 25,
    reward: 200,
    damage: 10,
    color: '#ff4040',
    size: 44,
  },
};
