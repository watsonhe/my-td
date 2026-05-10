export abstract class Scene {
  abstract enter(): void;
  abstract update(dt: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract exit(): void;
}
