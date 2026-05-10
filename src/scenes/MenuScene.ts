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

  enter(): void {
    musicPlayer.init();
    this.audioInited = false;
    this.buttons = [
      {
        x: CANVAS_WIDTH / 2 - 100,
        y: 330,
        width: 200,
        height: 48,
        label: '开始游戏',
        onClick: () => {
          musicPlayer.stop();
          SceneManager.replace(new LevelSelectScene());
        },
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
      // Resume audio context on first click (browser autoplay policy)
      if (!this.audioInited) {
        musicPlayer.resume();
        this.audioInited = true;
      }
      handleButtonClick(this.buttons, mouse.x, mouse.y);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH * 0.3, 100, 200, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH * 0.7, 450, 250, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f0e0c0';
    ctx.font = 'bold 52px serif';
    ctx.textAlign = 'center';
    ctx.fillText('修仙塔防', CANVAS_WIDTH / 2, 160);

    ctx.fillStyle = '#c0b0a0';
    ctx.font = '20px serif';
    ctx.fillText('— 以仙道之力，守山门安宁 —', CANVAS_WIDTH / 2, 210);

    ctx.fillStyle = '#6a6a7a';
    ctx.font = '14px serif';
    ctx.fillText('剑修 · 阵修 · 丹修 · 符修', CANVAS_WIDTH / 2, 260);

    const mouse = InputManager.mouse;
    for (const btn of this.buttons) {
      renderButton(ctx, btn, mouse.x, mouse.y);
    }
  }
}
