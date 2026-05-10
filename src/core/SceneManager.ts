import { Scene } from './Scene';

class SceneManagerImpl {
  private scenes: Scene[] = [];

  get current(): Scene | null {
    return this.scenes.length > 0 ? this.scenes[this.scenes.length - 1] : null;
  }

  push(scene: Scene): void {
    if (this.current) this.current.exit();
    this.scenes.push(scene);
    scene.enter();
  }

  pop(): Scene | null {
    const scene = this.scenes.pop();
    if (scene) {
      scene.exit();
    }
    if (this.current) {
      this.current.enter();
    }
    return scene ?? null;
  }

  replace(scene: Scene): void {
    if (this.current) {
      this.current.exit();
      this.scenes.pop();
    }
    this.scenes.push(scene);
    scene.enter();
  }

  update(dt: number): void {
    // Update from bottom to top, only topmost handles input
    for (let i = this.scenes.length - 1; i >= 0; i--) {
      this.scenes[i].update(dt);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const scene of this.scenes) {
      scene.render(ctx);
    }
  }
}

export const SceneManager = new SceneManagerImpl();
