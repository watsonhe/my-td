import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LEVELS } from '../config/levels';
import { GameScene } from './GameScene';
import { MenuScene } from './MenuScene';

const LEVEL_COLORS = ['#f0833a', '#2363a3', '#e53935'];

export class LevelSelectScene extends Scene {
  private buttons: Button[] = [];

  enter(): void {
    this.buttons = LEVELS.map((level, i) => ({
      x: CANVAS_WIDTH / 2 - 180,
      y: 175 + i * 95,
      width: 360,
      height: 68,
      label: `${level.name}\n${level.description}`,
      onClick: () => SceneManager.replace(new GameScene(level)),
      color: LEVEL_COLORS[i] ?? '#f0833a',
      hoverColor: '#fff',
      textColor: '#fff',
      fontSize: 16,
    }));

    this.buttons.push({
      x: CANVAS_WIDTH / 2 - 60,
      y: CANVAS_HEIGHT - 80,
      width: 120,
      height: 38,
      label: '返回',
      onClick: () => SceneManager.replace(new MenuScene()),
      color: '#78909c',
      hoverColor: '#90a4ae',
      textColor: '#fff',
    });
  }

  exit(): void {}

  update(_dt: number): void {
    if (InputManager.mouse.justClicked) {
      handleButtonClick(this.buttons, InputManager.mouse.x, InputManager.mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // DB Namek sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#5cb5a0');
    grad.addColorStop(1, '#a8e0d0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title card
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#2363a3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 160, 60, 320, 60, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1565c0';
    ctx.font = 'bold 32px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText('选择关卡', CANVAS_WIDTH / 2, 100);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }
}
