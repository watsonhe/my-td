import { Enemy } from '../entities/Enemy';
import { createEnemy } from '../entities/Enemy';
import { EventBus } from '../core/EventBus';
import { WaveConfig, WaveEnemyGroup } from '../config/levels';
import { Grid } from '../map/Grid';

interface SpawnState {
  groupIndex: number;
  spawnedInGroup: number;
  nextSpawnTime: number;
}

export class WaveSystem {
  private waves: WaveConfig[];
  private waypoints: { x: number; y: number }[];
  private grid: Grid;
  private currentWaveIndex = -1;
  private timeBetweenWaves = 0;
  private waveTime = 0;
  private spawn: SpawnState | null = null;
  private allWavesDone = false;
  private enemiesRemaining = 0;

  constructor(waves: WaveConfig[], waypoints: { x: number; y: number }[], grid: Grid) {
    this.waves = waves;
    this.waypoints = waypoints;
    this.grid = grid;
  }

  get currentWave(): number { return this.currentWaveIndex + 1; }
  get totalWaves(): number { return this.waves.length; }
  get isActive(): boolean { return this.spawn !== null; }
  get isAllDone(): boolean { return this.allWavesDone && this.enemiesRemaining <= 0; }

  update(dt: number, enemies: Enemy[]): void {
    // Track remaining enemies from spawns
    this.enemiesRemaining = enemies.filter(e => e.alive).length;

    if (this.allWavesDone) return;

    this.waveTime += dt;

    // Start next wave
    if (this.spawn === null) {
      const nextIdx = this.currentWaveIndex + 1;
      if (nextIdx >= this.waves.length) return;

      const wave = this.waves[nextIdx];
      if (this.waveTime >= wave.preDelay) {
        this.currentWaveIndex = nextIdx;
        this.spawn = {
          groupIndex: 0,
          spawnedInGroup: 0,
          nextSpawnTime: 0,
        };
        EventBus.emit('wave:start', { wave: this.currentWaveIndex + 1, total: this.waves.length });
      }
      return;
    }

    // Spawn enemies for current wave
    const wave = this.waves[this.currentWaveIndex];
    const group = wave.groups[this.spawn.groupIndex];
    if (!group) {
      // All groups done for this wave
      this.spawn = null;
      this.waveTime = 0;
      EventBus.emit('wave:end', { wave: this.currentWaveIndex + 1, total: this.waves.length });
      if (this.currentWaveIndex >= this.waves.length - 1) {
        this.allWavesDone = true;
        EventBus.emit('wave:all_clear');
      }
      return;
    }

    this.spawn.nextSpawnTime -= dt;
    if (this.spawn.nextSpawnTime <= 0) {
      const startPos = this.grid.gridToPixel(this.waypoints[0].x, this.waypoints[0].y);
      const enemy = createEnemy(group.type, startPos.x, startPos.y);
      enemies.push(enemy);
      EventBus.emit('enemy:spawned', enemy);

      this.spawn.spawnedInGroup++;
      if (this.spawn.spawnedInGroup >= group.count) {
        this.spawn.groupIndex++;
        this.spawn.spawnedInGroup = 0;
      }
      this.spawn.nextSpawnTime = group.interval;
    }
  }

  reset(): void {
    this.currentWaveIndex = -1;
    this.waveTime = 0;
    this.spawn = null;
    this.allWavesDone = false;
    this.enemiesRemaining = 0;
  }
}
