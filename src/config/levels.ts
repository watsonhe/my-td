import { TowerType } from './towers';
import { EnemyType } from './enemies';

export interface WaveEnemyGroup {
  type: EnemyType;
  count: number;
  interval: number; // seconds between spawns
}

export interface WaveConfig {
  preDelay: number;
  groups: WaveEnemyGroup[];
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  grid: number[][];
  waypoints: { x: number; y: number }[];
  waves: WaveConfig[];
  startSpirit: number;
  startLives: number;
  availableTowers: TowerType[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '翠竹峰',
    description: '妖魔初现，守住山门！',
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    ],
    waypoints: [
      { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 3 },
      { x: 12, y: 3 }, { x: 12, y: 9 },
    ],
    waves: [
      { preDelay: 3, groups: [{ type: 'imp', count: 6, interval: 1.0 }] },
      { preDelay: 5, groups: [{ type: 'imp', count: 8, interval: 0.8 }] },
      { preDelay: 5, groups: [{ type: 'imp', count: 4, interval: 0.6 }, { type: 'beast', count: 2, interval: 1.5 }] },
      { preDelay: 8, groups: [{ type: 'beast', count: 6, interval: 1.0 }] },
      { preDelay: 8, groups: [{ type: 'beast', count: 4, interval: 0.8 }, { type: 'demon', count: 1, interval: 2.0 }] },
      { preDelay: 10, groups: [{ type: 'demon', count: 3, interval: 1.5 }, { type: 'beast', count: 4, interval: 0.6 }] },
      { preDelay: 12, groups: [{ type: 'boss', count: 1, interval: 2.0 }, { type: 'imp', count: 6, interval: 0.5 }] },
    ],
    startSpirit: 300,
    startLives: 20,
    availableTowers: ['sword', 'array', 'alchemy', 'talisman'],
  },
  {
    id: 2,
    name: '幽冥峡谷',
    description: '妖魔势大，坚守峡谷要道！',
    grid: [
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    waypoints: [
      { x: 0, y: 4 }, { x: 6, y: 4 }, { x: 6, y: 0 },
      { x: 6, y: 9 }, { x: 14, y: 4 },
    ],
    waves: [
      { preDelay: 3, groups: [{ type: 'imp', count: 8, interval: 0.8 }] },
      { preDelay: 5, groups: [{ type: 'beast', count: 4, interval: 1.2 }, { type: 'imp', count: 4, interval: 0.5 }] },
      { preDelay: 5, groups: [{ type: 'beast', count: 6, interval: 0.8 }] },
      { preDelay: 8, groups: [{ type: 'demon', count: 2, interval: 2.0 }, { type: 'beast', count: 4, interval: 0.7 }] },
      { preDelay: 8, groups: [{ type: 'demon', count: 4, interval: 1.2 }] },
      { preDelay: 10, groups: [{ type: 'beast', count: 6, interval: 0.5 }, { type: 'demon', count: 2, interval: 1.0 }] },
      { preDelay: 10, groups: [{ type: 'boss', count: 1, interval: 3.0 }, { type: 'demon', count: 2, interval: 1.5 }] },
      { preDelay: 12, groups: [{ type: 'demon', count: 4, interval: 0.8 }, { type: 'boss', count: 1, interval: 2.0 }] },
    ],
    startSpirit: 350,
    startLives: 20,
    availableTowers: ['sword', 'array', 'alchemy', 'talisman'],
  },
  {
    id: 3,
    name: '魔渊深处',
    description: '最终决战，消灭妖王！',
    grid: [
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    ],
    waypoints: [
      { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 },
      { x: 8, y: 2 }, { x: 8, y: 4 }, { x: 2, y: 4 },
      { x: 2, y: 7 }, { x: 10, y: 7 }, { x: 10, y: 9 }, { x: 14, y: 9 },
    ],
    waves: [
      { preDelay: 5, groups: [{ type: 'beast', count: 6, interval: 0.8 }] },
      { preDelay: 5, groups: [{ type: 'demon', count: 3, interval: 1.5 }, { type: 'beast', count: 4, interval: 0.6 }] },
      { preDelay: 5, groups: [{ type: 'demon', count: 5, interval: 1.0 }] },
      { preDelay: 8, groups: [{ type: 'beast', count: 8, interval: 0.4 }, { type: 'demon', count: 2, interval: 1.0 }] },
      { preDelay: 8, groups: [{ type: 'demon', count: 4, interval: 0.8 }, { type: 'boss', count: 1, interval: 2.0 }] },
      { preDelay: 10, groups: [{ type: 'boss', count: 1, interval: 2.0 }, { type: 'demon', count: 3, interval: 0.8 }] },
      { preDelay: 10, groups: [{ type: 'demon', count: 5, interval: 0.6 }, { type: 'beast', count: 6, interval: 0.4 }] },
      { preDelay: 12, groups: [{ type: 'boss', count: 2, interval: 2.0 }, { type: 'demon', count: 4, interval: 0.5 }] },
    ],
    startSpirit: 400,
    startLives: 15,
    availableTowers: ['sword', 'array', 'alchemy', 'talisman'],
  },
];
