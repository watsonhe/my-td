import { TowerType, TowerConfig, TOWER_CONFIGS } from '../config/towers';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, isInside } from './Button';

export class TowerPanelUI {
  buttons: Button[] = [];
  private types: TowerType[] = [];

  setAvailable(types: TowerType[], onSelect: (type: TowerType) => void, canAfford: (cost: number) => boolean): void {
    this.types = types;
    const y = CANVAS_HEIGHT - 88;
    const btnW = 108;
    const gap = 10;
    const tw = types.length * btnW + (types.length - 1) * gap;
    const sx = (CANVAS_WIDTH - tw) / 2;

    this.buttons = types.map((type, i) => {
      const cfg = TOWER_CONFIGS[type];
      return {
        x: sx + i * (btnW + gap),
        y,
        width: btnW,
        height: 80,
        label: `${cfg.icon} ${cfg.name}\n${cfg.buildCost} 灵`,
        onClick: () => onSelect(type),
        color: cfg.color,
        hoverColor: cfg.glowColor,
        textColor: '#fff',
        enabled: canAfford(cfg.buildCost),
        fontSize: 14,
      };
    });
  }

  updateAfford(canAfford: (cost: number) => boolean): void {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].enabled = canAfford(TOWER_CONFIGS[this.types[i]].buildCost);
    }
  }

  render(ctx: CanvasRenderingContext2D, mx: number, my: number): void {
    for (const btn of this.buttons) renderButton(ctx, btn, mx, my);
  }

  getClicked(x: number, y: number): TowerType | null {
    for (let i = 0; i < this.buttons.length; i++) {
      if (isInside(this.buttons[i], x, y) && this.buttons[i].enabled !== false) {
        return this.types[i];
      }
    }
    return null;
  }
}
