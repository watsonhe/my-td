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
  speed: number;
  reward: number;
  damage: number;
  color: string;
  outlineColor: string;
  eyeColor: string;
  mouthColor: string;
  size: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  imp: {
    type: 'imp',
    hp: 60,
    speed: 60,
    reward: 15,
    damage: 1,
    color: '#ff6b6b',
    outlineColor: '#c0392b',
    eyeColor: '#fff',
    mouthColor: '#7b0000',
    size: 24,
  },
  beast: {
    type: 'beast',
    hp: 150,
    speed: 45,
    reward: 30,
    damage: 2,
    color: '#ffab40',
    outlineColor: '#bf6f00',
    eyeColor: '#fff',
    mouthColor: '#6b3a00',
    size: 30,
  },
  demon: {
    type: 'demon',
    hp: 350,
    speed: 35,
    reward: 60,
    damage: 3,
    color: '#b388ff',
    outlineColor: '#5a1fc0',
    eyeColor: '#ff0',
    mouthColor: '#2a0050',
    size: 34,
  },
  boss: {
    type: 'boss',
    hp: 1200,
    speed: 25,
    reward: 200,
    damage: 10,
    color: '#ff1744',
    outlineColor: '#8b0000',
    eyeColor: '#ff0',
    mouthColor: '#4a0000',
    size: 44,
  },
};
