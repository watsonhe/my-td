import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { InputManager } from './InputManager';
import { SceneManager } from './SceneManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime = 0;
  private running = true;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext('2d')!;
    InputManager.init(this.canvas);
  }

  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  start(): void {
    this.lastTime = performance.now();
    this.running = true;
    requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
  }

  private loop = (time: number): void => {
    if (!this.running) return;

    const rawDt = (time - this.lastTime) / 1000;
    const dt = Math.min(rawDt, 0.05); // cap to avoid spiral of death
    this.lastTime = time;

    InputManager.poll();
    SceneManager.update(dt);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    SceneManager.render(this.ctx);

    requestAnimationFrame(this.loop);
  };
}
