import { TowerType, TowerConfig, TOWER_CONFIGS } from '../config/towers';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, isInside } from './Button';

export class TowerPanelUI {
  buttons: Button[] = [];
  private types: TowerType[] = [];

  setAvailable(types: TowerType[], onSelect: (type: TowerType) => void, canAfford: (cost: number) => boolean): void {
    this.types = types;
    const y = CANVAS_HEIGHT - 90;
    const btnW = 100;
    const spacing = 10;
    const totalW = types.length * btnW + (types.length - 1) * spacing;
    const startX = (CANVAS_WIDTH - totalW) / 2;

    this.buttons = types.map((type, i) => {
      const config = TOWER_CONFIGS[type];
      return {
        x: startX + i * (btnW + spacing),
        y,
        width: btnW,
        height: 80,
        label: `${config.icon} ${config.name}\n${config.buildCost}灵`,
        onClick: () => onSelect(type),
        color: '#3a4a3a',
        hoverColor: '#5a7a5a',
        enabled: canAfford(config.buildCost),
        fontSize: 13,
      };
    });
  }

  updateAfford(canAfford: (cost: number) => boolean): void {
    for (let i = 0; i < this.buttons.length; i++) {
      const type = this.types[i];
      const config = TOWER_CONFIGS[type];
      this.buttons[i].enabled = canAfford(config.buildCost);
    }
  }

  render(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number): void {
    for (const btn of this.buttons) {
      renderButton(ctx, btn, mouseX, mouseY);
    }
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
