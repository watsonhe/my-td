import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { EventBus } from '../core/EventBus';
import { Grid } from '../map/Grid';
import { MapRenderer } from '../map/MapRenderer';
import { WaveSystem } from '../systems/WaveSystem';
import { PathSystem } from '../systems/PathSystem';
import { TargetingSystem } from '../systems/TargetingSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { EconomySystem } from '../systems/EconomySystem';
import { EffectSystem } from '../systems/EffectSystem';
import { BossSystem } from '../systems/BossSystem';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Particle } from '../entities/Particle';
import { renderTower, renderEnemy, renderProjectile } from '../entities/Renderer';
import { LevelConfig } from '../config/levels';
import { renderHUD, isMusicToggleClick } from '../ui/HUD';
import { TowerPanelUI } from '../ui/TowerPanel';
import { UpgradePanel } from '../ui/UpgradePanel';
import { WaveIndicator } from '../ui/WaveIndicator';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/constants';
import { TowerType } from '../config/towers';
import { ResultScene } from './ResultScene';
import { musicPlayer } from '../audio/MusicPlayer';

export class GameScene extends Scene {
  private grid: Grid;
  private mapRenderer = new MapRenderer();
  private waveSystem: WaveSystem;
  private pathSystem: PathSystem;
  private targetingSystem: TargetingSystem;
  private combatSystem: CombatSystem;
  private bossSystem: BossSystem;
  private economySystem = new EconomySystem();
  private effectSystem = new EffectSystem();
  private towerPanel = new TowerPanelUI();
  private upgradePanel = new UpgradePanel();
  private waveIndicator = new WaveIndicator();

  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];

  spirit = 0;
  lives = 20;
  private kills = 0;
  private gameSpeed = 1;
  private selectedTower: Tower | null = null;
  private placingType: TowerType | null = null;
  private gameOver = false;
  private musicOn = true;
  private levelConfig: LevelConfig;

  constructor(level: LevelConfig) {
    super();
    this.levelConfig = level;
    this.grid = new Grid(level.grid);
    this.waveSystem = new WaveSystem(level.waves, level.waypoints, this.grid);
    this.pathSystem = new PathSystem(level.waypoints, this.grid);
    this.targetingSystem = new TargetingSystem(this.grid);
    this.combatSystem = new CombatSystem(this.grid);
    this.bossSystem = new BossSystem(this.grid);
  }

  enter(): void {
    this.spirit = this.levelConfig.startSpirit;
    this.lives = this.levelConfig.startLives;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.selectedTower = null;
    this.placingType = null;
    this.gameOver = false;
    this.kills = 0;
    this.gameSpeed = 1;

    this.towerPanel.setAvailable(
      this.levelConfig.availableTowers,
      (type) => this.startPlacing(type),
      (cost) => this.spirit >= cost,
    );

    this.setupEvents();
    this.waveIndicator.show('妖魔来袭！', 2);
    musicPlayer.playLevel(this.levelConfig.id - 1);
  }

  exit(): void {
    musicPlayer.stop();
    EventBus.clear();
  }

  private setupEvents(): void {
    EventBus.on('enemy:killed', (e: Enemy) => {
      this.spirit += e.reward;
      this.kills++;
    });

    EventBus.on('enemy:reached_end', (e: Enemy) => {
      this.lives -= e.damage;
      if (this.lives <= 0) {
        this.lives = 0;
        this.endGame(false);
      }
    });

    EventBus.on('wave:start', ({ wave, total }: { wave: number; total: number }) => {
      this.waveIndicator.show(`第 ${wave}/${total} 波妖魔潮！`);
    });

    EventBus.on('wave:all_clear', () => {
      // Check win after a short delay (enemies may still be alive)
    });
  }

  update(dt: number): void {
    if (this.gameOver) return;

    const scaledDt = dt * this.gameSpeed;
    const mouse = InputManager.mouse;

    // Speed toggle (only when not placing)
    if (!this.placingType && mouse.justRightClicked) {
      this.gameSpeed = this.gameSpeed === 1 ? 2 : this.gameSpeed === 2 ? 4 : 1;
    }

    // Music toggle (works even during placement)
    if (mouse.justClicked && isMusicToggleClick(mouse.x, mouse.y)) {
      this.musicOn = !this.musicOn;
      musicPlayer.setMasterVolume(this.musicOn ? 0.6 : 0);
    }

    // Handle input for tower placement
    if (this.placingType) {
      if (mouse.justClicked && !isMusicToggleClick(mouse.x, mouse.y)) {
        this.tryPlaceTower(mouse.gridX, mouse.gridY);
        this.placingType = null;
      }
      if (mouse.justRightClicked) {
        this.placingType = null;
      }
      return;
    }

    // Tower selection / deselection + upgrade panel handling
    if (mouse.justClicked) {
      // Handle upgrade panel clicks first
      if (this.selectedTower) {
        const action = this.upgradePanel.getClickedButton(mouse.x, mouse.y);
        if (action === 'upgrade') {
          this.economySystem.upgradeTower(this.selectedTower, this);
          this.upgradePanel.setTower(this.selectedTower); // refresh
        } else if (action === 'sell') {
          this.economySystem.sellTower(this.selectedTower, this);
          this.towers = this.towers.filter(t => t.id !== this.selectedTower!.id);
          this.selectedTower = null;
          this.upgradePanel.setTower(null);
        }
      }

      // Handle tower panel clicks
      const towerType = this.towerPanel.getClicked(mouse.x, mouse.y);
      if (towerType) {
        this.startPlacing(towerType);
      }

      const isOnUI = this.isClickOnUI(mouse.x, mouse.y);
      if (!isOnUI && !towerType) {
        const clickedTower = this.getTowerAt(mouse.gridX, mouse.gridY);
        if (clickedTower) {
          this.selectedTower = clickedTower;
          this.upgradePanel.setTower(clickedTower);
        } else if (!this.upgradePanel.getClickedButton(mouse.x, mouse.y)) {
          this.selectedTower = null;
          this.upgradePanel.setTower(null);
        }
      }
    }

    // Update systems
    this.waveSystem.update(scaledDt, this.enemies);
    this.pathSystem.update(scaledDt, this.enemies);
    this.targetingSystem.update(this.towers, this.enemies);
    this.bossSystem.update(scaledDt, this.enemies, this.towers, this.particles);
    this.combatSystem.update(scaledDt, this.towers, this.enemies, this.projectiles, this.particles);
    this.combatSystem.updateDebuffs(scaledDt, this.enemies);
    this.effectSystem.update(scaledDt, this.particles);

    // Clean up dead entities
    this.enemies = this.enemies.filter(e => e.alive);
    this.towers = this.towers.filter(t => t.alive);
    this.projectiles = this.projectiles.filter(p => p.alive);
    this.particles = this.particles.filter(p => p.alive);

    // Clear selected tower if it was destroyed
    if (this.selectedTower && !this.selectedTower.alive) {
      this.selectedTower = null;
      this.upgradePanel.setTower(null);
    }

    // Tick tower damage flash timers
    for (const tower of this.towers) {
      if (tower.damageFlashTimer > 0) {
        tower.damageFlashTimer -= scaledDt;
      }
    }

    // Update UI state
    this.towerPanel.updateAfford((cost) => this.spirit >= cost);
    this.waveIndicator.update(dt); // real time for UI feedback

    // Check win condition
    if (this.waveSystem.isAllDone && this.enemies.filter(e => e.alive).length === 0) {
      this.endGame(true);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Map
    this.mapRenderer.render(ctx, this.grid, this.towers);

    // Range indicator — DB ki-sense style
    if (this.selectedTower) {
      const pos = this.grid.gridToPixel(this.selectedTower.gridX, this.selectedTower.gridY);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.selectedTower.range, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = this.selectedTower.config.glowColor + '50';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Placement preview — DB ki landing zone
    if (this.placingType) {
      const mouse = InputManager.mouse;
      const pos = this.grid.gridToPixel(mouse.gridX, mouse.gridY);
      const canPlace = this.grid.isBuildable(mouse.gridX, mouse.gridY) &&
        !this.towers.some(t => t.gridX === mouse.gridX && t.gridY === mouse.gridY);

      ctx.save();
      ctx.shadowColor = canPlace ? 'rgba(0,200,255,0.6)' : 'rgba(244,67,54,0.6)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = canPlace ? 'rgba(0,180,255,0.3)' : 'rgba(244,67,54,0.3)';
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = canPlace ? '#29b6f6' : '#f44336';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Enemies
    for (const enemy of this.enemies) {
      renderEnemy(ctx, enemy);
    }

    // Projectiles
    for (const proj of this.projectiles) {
      renderProjectile(ctx, proj);
    }

    // Towers
    for (const tower of this.towers) {
      renderTower(ctx, tower, this.grid);
    }

    // Particles
    this.effectSystem.render(ctx, this.particles);

    // HUD
    renderHUD(ctx, {
      spirit: this.spirit,
      lives: this.lives,
      wave: this.waveSystem.currentWave,
      totalWaves: this.waveSystem.totalWaves,
      kills: this.kills,
      gameSpeed: this.gameSpeed,
      musicOn: this.musicOn,
    });

    // Tower panel
    this.towerPanel.render(ctx, InputManager.mouse.x, InputManager.mouse.y);

    // Upgrade panel
    this.upgradePanel.render(ctx, InputManager.mouse.x, InputManager.mouse.y);

    // Wave indicator
    this.waveIndicator.render(ctx);

    // Placing mode hint
    if (this.placingType) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('点击地图放置 (右键取消)', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 110);
    }
  }

  private startPlacing(type: TowerType): void {
    this.placingType = type;
    this.selectedTower = null;
    this.upgradePanel.setTower(null);
  }

  private tryPlaceTower(col: number, row: number): void {
    if (!this.grid.isBuildable(col, row)) return;
    if (this.towers.some(t => t.gridX === col && t.gridY === row)) return;

    const tower = this.economySystem.placeTower(this.placingType!, col, row, this);
    if (tower) {
      this.towers.push(tower);
    }
  }

  private getTowerAt(col: number, row: number): Tower | null {
    return this.towers.find(t => t.gridX === col && t.gridY === row) ?? null;
  }

  private isClickOnUI(x: number, y: number): boolean {
    // Check bottom tower panel area
    if (y > CANVAS_HEIGHT - 100) return true;
    // Check upgrade panel area
    if (x > CANVAS_WIDTH - 210 && y < 200) return true;
    return false;
  }

  private endGame(won: boolean): void {
    this.gameOver = true;
    SceneManager.push(new ResultScene(won, this.kills, this.levelConfig));
  }
}
