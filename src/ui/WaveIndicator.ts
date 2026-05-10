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

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(CANVAS_WIDTH / 2 - 150, 220, 300, 60);

    ctx.fillStyle = '#f0e0c0';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.message, CANVAS_WIDTH / 2, 250);
  }
}
