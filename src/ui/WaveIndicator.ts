import { CANVAS_WIDTH } from '../utils/constants';

export class WaveIndicator {
  private message = '';
  private timer = 0;

  show(text: string, duration?: number): void {
    this.message = text;
    this.timer = duration ?? 2.0;
  }

  update(dt: number): void {
    if (this.timer > 0) {
      this.timer -= dt;
      if (this.timer <= 0) this.message = '';
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.message) return;

    const x = CANVAS_WIDTH / 2 - 160;
    const y = 230;
    const w = 320;
    const h = 52;

    // Background card
    ctx.fillStyle = 'rgba(255,255,255,0.93)';
    ctx.strokeStyle = '#ff7043';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // Message
    ctx.fillStyle = '#e65100';
    ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.message, CANVAS_WIDTH / 2, y + h / 2);
  }
}
