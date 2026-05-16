import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LEVELS } from '../config/levels';
import { GameScene } from './GameScene';
import { MenuScene } from './MenuScene';

const LEVEL_COLORS = ['#ff8a65', '#ffb74d', '#ef5350'];

export class LevelSelectScene extends Scene {
  private buttons: Button[] = [];

  enter(): void {
    this.buttons = LEVELS.map((level, i) => ({
      x: CANVAS_WIDTH / 2 - 170,
      y: 170 + i * 90,
      width: 340,
      height: 66,
      label: `${level.name}\n${level.description}`,
      onClick: () => SceneManager.replace(new GameScene(level)),
      color: LEVEL_COLORS[i] ?? '#ff8a65',
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
      color: '#90a4ae',
      hoverColor: '#b0bec5',
      textColor: '#fff',
    });
  }

  exit(): void {}

  update(_dt: number): void {
    const mouse = InputManager.mouse;
    if (mouse.justClicked) {
      handleButtonClick(this.buttons, mouse.x, mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Warm gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#fff3e0');
    grad.addColorStop(1, '#ffe0b2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title
    ctx.fillStyle = '#e65100';
    ctx.font = 'bold 38px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText('选择关卡', CANVAS_WIDTH / 2, 110);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }
}
