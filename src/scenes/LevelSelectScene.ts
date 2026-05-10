import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LEVELS } from '../config/levels';
import { GameScene } from './GameScene';
import { MenuScene } from './MenuScene';

export class LevelSelectScene extends Scene {
  private buttons: Button[] = [];

  enter(): void {
    this.buttons = LEVELS.map((level, i) => ({
      x: CANVAS_WIDTH / 2 - 150,
      y: 160 + i * 80,
      width: 300,
      height: 60,
      label: `${level.name} — ${level.description}`,
      onClick: () => SceneManager.replace(new GameScene(level)),
      color: '#3a4a3a',
      hoverColor: '#5a7a5a',
    }));

    // Back button
    this.buttons.push({
      x: CANVAS_WIDTH / 2 - 60,
      y: CANVAS_HEIGHT - 80,
      width: 120,
      height: 36,
      label: '返回',
      onClick: () => SceneManager.replace(new MenuScene()),
      color: '#4a4a4a',
      hoverColor: '#6a6a6a',
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
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f0e0c0';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('选择关卡', CANVAS_WIDTH / 2, 100);

    const mouse = InputManager.mouse;
    for (const btn of this.buttons) {
      renderButton(ctx, btn, mouse.x, mouse.y);
    }
  }
}
