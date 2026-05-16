import { Scene } from '../core/Scene';
import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, handleButtonClick } from '../ui/Button';
import { LevelSelectScene } from './LevelSelectScene';
import { musicPlayer } from '../audio/MusicPlayer';

export class MenuScene extends Scene {
  private buttons: Button[] = [];
  private audioInited = false;
  private frame = 0;

  enter(): void {
    musicPlayer.init();
    this.audioInited = false;
    this.buttons = [
      {
        x: CANVAS_WIDTH / 2 - 110,
        y: 340,
        width: 220,
        height: 52,
        label: '开始游戏',
        onClick: () => {
          musicPlayer.stop();
          SceneManager.replace(new LevelSelectScene());
        },
        color: '#ff6d3a',
        hoverColor: '#ff8a5c',
        textColor: '#fff',
        fontSize: 22,
      },
    ];
  }

  exit(): void {}

  update(_dt: number): void {
    this.frame++;
    const mouse = InputManager.mouse;
    if (mouse.justClicked) {
      if (!this.audioInited) {
        musicPlayer.resume();
        this.audioInited = true;
      }
      handleButtonClick(this.buttons, mouse.x, mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Sky gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#87ceeb');
    grad.addColorStop(0.5, '#e8f5e9');
    grad.addColorStop(1, '#c8e6c9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Floating clouds
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    this.drawCloud(ctx, 140 + Math.sin(this.frame * 0.008) * 15, 80, 1.0);
    this.drawCloud(ctx, 700 + Math.sin(this.frame * 0.006 + 1) * 20, 420, 0.8);
    this.drawCloud(ctx, 200 + Math.sin(this.frame * 0.007 + 2) * 18, 500, 0.6);

    // Decorative mountain silhouettes
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(0, 480);
    ctx.quadraticCurveTo(200, 380, 350, 460);
    ctx.quadraticCurveTo(500, 320, 700, 440);
    ctx.quadraticCurveTo(850, 360, CANVAS_WIDTH, 430);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Title card
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeStyle = '#ff6d3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 200, 100, 400, 140, 16);
    ctx.fill();
    ctx.stroke();

    // Title text
    ctx.fillStyle = '#ff5722';
    ctx.font = 'bold 56px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText('修仙塔防', CANVAS_WIDTH / 2, 175);

    // Subtitle
    ctx.fillStyle = '#795548';
    ctx.font = '18px "Microsoft YaHei", sans-serif';
    ctx.fillText('— 以仙道之力，守山门安宁 —', CANVAS_WIDTH / 2, 215);

    // Tower type showcase
    ctx.fillStyle = '#5d4037';
    ctx.font = '15px "Microsoft YaHei", sans-serif';
    ctx.fillText('剑修 · 阵修 · 丹修 · 符修', CANVAS_WIDTH / 2, 290);

    // Buttons
    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void {
    ctx.beginPath();
    ctx.arc(x, y, 40 * scale, 0, Math.PI * 2);
    ctx.arc(x + 35 * scale, y - 15 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 65 * scale, y, 35 * scale, 0, Math.PI * 2);
    ctx.arc(x + 30 * scale, y + 10 * scale, 28 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}
