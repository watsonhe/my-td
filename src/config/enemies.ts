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
  color: string;        // skin color
  outlineColor: string; // thick outline
  accentColor: string;  // armor/feature color
  eyeColor: string;
  size: number;
  attackDamage?: number;   // tower-destroying: damage per hit
  attackRange?: number;    // tower-destroying: proximity trigger radius (px)
  attackCooldown?: number; // tower-destroying: seconds between attacks
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  imp: {
    type: 'imp',
    hp: 60,
    speed: 60,
    reward: 15,
    damage: 1,
    color: '#7bcb4a',        // Saibaiman green
    outlineColor: '#2d5a1a',
    accentColor: '#c73e3e',  // red spots
    eyeColor: '#fff',
    size: 24,
  },
  beast: {
    type: 'beast',
    hp: 150,
    speed: 45,
    reward: 30,
    damage: 2,
    color: '#f0833a',        // orange-brown dinosaur
    outlineColor: '#8b3a0a',
    accentColor: '#ffcc00',  // yellow belly
    eyeColor: '#ff0',
    size: 30,
  },
  demon: {
    type: 'demon',
    hp: 350,
    speed: 35,
    reward: 60,
    damage: 3,
    color: '#7c5ce0',        // Freeza soldier purple
    outlineColor: '#3a1f8a',
    accentColor: '#ff4444',  // red scouter/armor
    eyeColor: '#ff0',
    size: 34,
  },
  boss: {
    type: 'boss',
    hp: 1200,
    speed: 18,
    reward: 200,
    damage: 10,
    color: '#ff7093',        // Majin Buu pink
    outlineColor: '#8b1a3a',
    accentColor: '#ffe44d',  // gold crown/cape
    eyeColor: '#fff',
    size: 44,
    attackDamage: 60,
    attackRange: 80,
    attackCooldown: 2.5,
  },
};
