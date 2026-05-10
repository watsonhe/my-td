import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LEVELS, LevelConfig } from '../config/levels';
import { MenuScene } from './MenuScene';
import { GameScene } from './GameScene';

export class ResultScene extends Scene {
  private won: boolean;
  private kills: number;
  private level: LevelConfig;
  private buttons: Button[] = [];

  constructor(won: boolean, kills: number, level: LevelConfig) {
    super();
    this.won = won;
    this.kills = kills;
    this.level = level;
  }

  enter(): void {
    const nextLevel = LEVELS.find(l => l.id === this.level.id + 1);

    this.buttons = [
      {
        x: CANVAS_WIDTH / 2 - 120,
        y: 340,
        width: 240,
        height: 44,
        label: '返回主菜单',
        onClick: () => SceneManager.replace(new MenuScene()),
        color: '#4a4a6a',
        hoverColor: '#6a6a8a',
      },
    ];

    if (this.won && nextLevel) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 120,
        y: 280,
        width: 240,
        height: 44,
        label: `下一关: ${nextLevel.name}`,
        onClick: () => SceneManager.replace(new GameScene(nextLevel)),
        color: '#4a6a4a',
        hoverColor: '#5a8a5a',
      });
    }

    if (!this.won) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 120,
        y: 280,
        width: 240,
        height: 44,
        label: '重新挑战',
        onClick: () => SceneManager.replace(new GameScene(this.level)),
        color: '#6a4a4a',
        hoverColor: '#8a5a5a',
      });
    }
  }

  exit(): void {}

  update(_dt: number): void {
    const mouse = InputManager.mouse;
    if (mouse.justClicked) {
      handleButtonClick(this.buttons, mouse.x, mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    ctx.fillStyle = this.won ? '#f0c040' : '#f06060';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.won ? '守山成功！' : '阵眼破碎...', CANVAS_WIDTH / 2, 160);

    // Subtitle
    ctx.fillStyle = '#c0b0a0';
    ctx.font = '20px serif';
    const subtitle = this.won
      ? `${this.level.name} 已平定，仙门安宁。`
      : `${this.level.name} 失守，妖魔入侵...`;
    ctx.fillText(subtitle, CANVAS_WIDTH / 2, 210);

    // Stats
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '18px sans-serif';
    ctx.fillText(`击杀妖魔: ${this.kills}`, CANVAS_WIDTH / 2, 255);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }
}
