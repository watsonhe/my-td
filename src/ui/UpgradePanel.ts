import { Tower } from '../entities/Tower';
import { REALMS, RealmLevel } from '../config/upgrades';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { Button, renderButton, isInside } from './Button';

export class UpgradePanel {
  private tower: Tower | null = null;
  buttons: Button[] = [];

  setTower(tower: Tower | null): void {
    this.tower = tower;
    this.buttons = [];

    if (!tower) return;

    const x = CANVAS_WIDTH - 200;
    const y = 50;

    // Info display + upgrade button + sell button
    const realm = REALMS[tower.level - 1];
    const nextRealm = tower.level < 5 ? REALMS[tower.level] : null;

    if (nextRealm) {
      this.buttons.push({
        x,
        y: y + 60,
        width: 180,
        height: 36,
        label: `突破 ${nextRealm.name} (${nextRealm.cost}灵)`,
        onClick: () => {},
        color: '#5a4a1a',
        hoverColor: '#8a7a3a',
        fontSize: 14,
      });
    }

    this.buttons.push({
      x,
      y: y + 102,
      width: 180,
      height: 32,
      label: `出售 (${Math.floor(tower.totalInvested * 0.5)}灵)`,
      onClick: () => {},
      color: '#5a2020',
      hoverColor: '#8a3030',
      fontSize: 14,
    });
  }

  get towerData(): Tower | null { return this.tower; }

  render(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number): void {
    if (!this.tower) return;

    const x = CANVAS_WIDTH - 200;
    const y = 50;
    const realm = REALMS[this.tower.level - 1];

    // Panel bg
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 10, 200, 160, 6);
    ctx.fill();
    ctx.stroke();

    // Tower info
    ctx.fillStyle = '#f0e0c0';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.tower.config.icon} ${this.tower.config.name}`, x, y + 14);

    ctx.fillStyle = '#c0c0c0';
    ctx.font = '13px sans-serif';
    ctx.fillText(`境界: ${realm.name}  Lv.${this.tower.level}`, x, y + 34);
    ctx.fillText(`伤害: ${this.tower.damage} | 范围: ${this.tower.range}`, x, y + 52);

    for (const btn of this.buttons) {
      renderButton(ctx, btn, mouseX, mouseY);
    }
  }

  getClickedButton(x: number, y: number): 'upgrade' | 'sell' | null {
    if (!this.tower) return null;
    if (this.buttons.length >= 2 && isInside(this.buttons[0], x, y)) return 'upgrade';
    if (isInside(this.buttons[this.buttons.length - 1], x, y)) return 'sell';
    return null;
  }
}
