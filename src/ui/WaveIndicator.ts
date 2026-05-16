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

    const x = CANVAS_WIDTH / 2 - 155;
    const y = 225;
    const w = 310;
    const h = 50;

    // DB alert panel
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.strokeStyle = '#f0833a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();

    // DB red accent stripe
    ctx.fillStyle = '#e53935';
    ctx.fillRect(x, y, w, 5);

    ctx.fillStyle = '#c62828';
    ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.message, CANVAS_WIDTH / 2, y + h / 2 + 2);
  }
}
