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

    this.buttons = [{
      x: CANVAS_WIDTH / 2 - 130,
      y: 390,
      width: 260,
      height: 46,
      label: '返回主菜单',
      onClick: () => SceneManager.replace(new MenuScene()),
      color: '#78909c',
      hoverColor: '#90a4ae',
      textColor: '#fff',
    }];

    if (this.won && nextLevel) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 130,
        y: 325,
        width: 260,
        height: 48,
        label: `下一关: ${nextLevel.name}`,
        onClick: () => SceneManager.replace(new GameScene(nextLevel)),
        color: '#4caf50',
        hoverColor: '#66bb6a',
        textColor: '#fff',
      });
    }

    if (!this.won) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 130,
        y: 325,
        width: 260,
        height: 48,
        label: '重新挑战',
        onClick: () => SceneManager.replace(new GameScene(this.level)),
        color: '#f0833a',
        hoverColor: '#ffb74d',
        textColor: '#fff',
      });
    }
  }

  exit(): void {}

  update(_dt: number): void {
    if (InputManager.mouse.justClicked) {
      handleButtonClick(this.buttons, InputManager.mouse.x, InputManager.mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // DB sky
    const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bg.addColorStop(0, this.won ? '#e8f5e9' : '#fce4ec');
    bg.addColorStop(1, this.won ? '#c8e6c9' : '#f8bbd0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // DB-style result card
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.strokeStyle = this.won ? '#ffc107' : '#e53935';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 200, 90, 400, 190, 14);
    ctx.fill();
    ctx.stroke();

    // DB accent stripe
    ctx.fillStyle = this.won ? '#ffc107' : '#e53935';
    ctx.fillRect(CANVAS_WIDTH / 2 - 200, 90, 400, 6);

    // Title
    ctx.fillStyle = this.won ? '#e65100' : '#c62828';
    ctx.font = 'bold 44px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.won ? '守山成功！' : '阵眼破碎...', CANVAS_WIDTH / 2, 158);

    // Subtitle
    ctx.fillStyle = '#555';
    ctx.font = '17px "Microsoft YaHei", sans-serif';
    ctx.fillText(
      this.won ? `${this.level.name} 已平定！` : `${this.level.name} 失守...`,
      CANVAS_WIDTH / 2, 200,
    );

    // Stats with DB power-level feel
    ctx.fillStyle = '#f0833a';
    ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.fillText(`击杀: ${this.kills}`, CANVAS_WIDTH / 2, 252);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }
}
