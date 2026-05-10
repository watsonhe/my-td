import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LevelSelectScene } from './LevelSelectScene';

export class MenuScene extends Scene {
  private buttons: Button[] = [];

  enter(): void {
    this.buttons = [
      {
        x: CANVAS_WIDTH / 2 - 100,
        y: 330,
        width: 200,
        height: 48,
        label: '开始游戏',
        onClick: () => SceneManager.replace(new LevelSelectScene()),
        color: '#4a6a4a',
        hoverColor: '#5a8a5a',
        fontSize: 22,
      },
    ];
  }

  exit(): void {}

  update(_dt: number): void {
    const mouse = InputManager.mouse;
    if (mouse.justClicked) {
      handleButtonClick(this.buttons, mouse.x, mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Decorative clouds/mist
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH * 0.3, 100, 200, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH * 0.7, 450, 250, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = '#f0e0c0';
    ctx.font = 'bold 52px serif';
    ctx.textAlign = 'center';
    ctx.fillText('修仙塔防', CANVAS_WIDTH / 2, 160);

    // Subtitle
    ctx.fillStyle = '#c0b0a0';
    ctx.font = '20px serif';
    ctx.fillText('— 以仙道之力，守山门安宁 —', CANVAS_WIDTH / 2, 210);

    // Decorative text
    ctx.fillStyle = '#6a6a7a';
    ctx.font = '14px serif';
    ctx.fillText('剑修 · 阵修 · 丹修 · 符修', CANVAS_WIDTH / 2, 260);

    // Buttons
    const mouse = InputManager.mouse;
    for (const btn of this.buttons) {
      renderButton(ctx, btn, mouse.x, mouse.y);
    }
  }
}
