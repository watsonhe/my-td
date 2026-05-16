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
        x: CANVAS_WIDTH / 2 - 130,
        y: 380,
        width: 260,
        height: 46,
        label: '返回主菜单',
        onClick: () => SceneManager.replace(new MenuScene()),
        color: '#78909c',
        hoverColor: '#90a4ae',
        textColor: '#fff',
      },
    ];

    if (this.won && nextLevel) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 130,
        y: 315,
        width: 260,
        height: 48,
        label: `下一关: ${nextLevel.name}`,
        onClick: () => SceneManager.replace(new GameScene(nextLevel)),
        color: '#66bb6a',
        hoverColor: '#81c784',
        textColor: '#fff',
      });
    }

    if (!this.won) {
      this.buttons.unshift({
        x: CANVAS_WIDTH / 2 - 130,
        y: 315,
        width: 260,
        height: 48,
        label: '重新挑战',
        onClick: () => SceneManager.replace(new GameScene(this.level)),
        color: '#ff7043',
        hoverColor: '#ff8a65',
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
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    if (this.won) {
      grad.addColorStop(0, '#fff8e1');
      grad.addColorStop(1, '#ffecb3');
    } else {
      grad.addColorStop(0, '#fce4ec');
      grad.addColorStop(1, '#f8bbd0');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Result card
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = this.won ? '#ffc107' : '#f44336';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 200, 90, 400, 180, 16);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = this.won ? '#ff8f00' : '#c62828';
    ctx.font = 'bold 44px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.won ? '守山成功！' : '阵眼破碎...', CANVAS_WIDTH / 2, 155);

    // Subtitle
    ctx.fillStyle = '#795548';
    ctx.font = '18px "Microsoft YaHei", sans-serif';
    ctx.fillText(
      this.won ? `${this.level.name} 已平定，仙门安宁。` : `${this.level.name} 失守，妖魔入侵...`,
      CANVAS_WIDTH / 2, 200,
    );

    // Stats
    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
    ctx.fillText(`击杀妖魔: ${this.kills}`, CANVAS_WIDTH / 2, 245);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }
}
