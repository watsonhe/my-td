import { Particle, updateParticles, renderParticles } from '../entities/Particle';

export class EffectSystem {
  update(dt: number, particles: Particle[]): void {
    updateParticles(dt, particles);
  }

  render(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
    renderParticles(ctx, particles);
  }
}
