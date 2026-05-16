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
        x: CANVAS_WIDTH / 2 - 120,
        y: 350,
        width: 240,
        height: 56,
        label: '开始游戏',
        onClick: () => {
          musicPlayer.stop();
          SceneManager.replace(new LevelSelectScene());
        },
        color: '#f0833a',
        hoverColor: '#ffb74d',
        textColor: '#fff',
        fontSize: 24,
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
    // DB Tenkaichi Budokai sky: bright blue → white
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#4a90d9');
    grad.addColorStop(0.6, '#87ceeb');
    grad.addColorStop(1, '#c8e0c8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // DB-style stylized clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    this.drawDBCloud(ctx, 120 + Math.sin(this.frame * 0.005) * 12, 70, 1.0);
    this.drawDBCloud(ctx, 720 + Math.sin(this.frame * 0.004 + 1) * 15, 130, 0.7);
    this.drawDBCloud(ctx, 180 + Math.sin(this.frame * 0.006 + 2) * 10, 430, 0.55);

    // Rocky foreground (DB rocky wasteland feel)
    ctx.fillStyle = '#c9a96e';
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT);
    ctx.lineTo(0, 490);
    ctx.quadraticCurveTo(150, 430, 300, 470);
    ctx.quadraticCurveTo(500, 390, 680, 460);
    ctx.quadraticCurveTo(820, 420, CANVAS_WIDTH, 450);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Title card (DB tournament board style)
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#f0833a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 210, 95, 420, 145, 14);
    ctx.fill();
    ctx.stroke();

    // DB-style red ribbon at top of card
    ctx.fillStyle = '#e53935';
    ctx.fillRect(CANVAS_WIDTH / 2 - 210, 95, 420, 8);

    // Title
    ctx.fillStyle = '#e53935';
    ctx.font = 'bold 54px "Microsoft YaHei", serif';
    ctx.textAlign = 'center';
    ctx.fillText('修仙塔防', CANVAS_WIDTH / 2, 175);

    // Subtitle
    ctx.fillStyle = '#5d4037';
    ctx.font = '17px "Microsoft YaHei", sans-serif';
    ctx.fillText('— 以仙道之力，守山门安宁 —', CANVAS_WIDTH / 2, 218);

    // Shenron accent text
    ctx.fillStyle = '#f0833a';
    ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
    ctx.fillText('⚔ 剑修 · ◎ 阵修 · ☯ 丹修 · ㊯ 符修', CANVAS_WIDTH / 2, 300);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, InputManager.mouse.x, InputManager.mouse.y);
    }
  }

  private drawDBCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
    // DB clouds are distinct elongated ovals
    ctx.beginPath();
    ctx.ellipse(x, y, 50 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 30 * s, y - 8 * s, 35 * s, 14 * s, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - 25 * s, y + 5 * s, 30 * s, 12 * s, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}
