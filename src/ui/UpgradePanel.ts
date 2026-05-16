import { Tower } from '../entities/Tower';
import { REALMS } from '../config/upgrades';
import { CANVAS_WIDTH } from '../utils/constants';
import { Button, renderButton, isInside } from './Button';

export class UpgradePanel {
  private tower: Tower | null = null;
  buttons: Button[] = [];

  setTower(tower: Tower | null): void {
    this.tower = tower;
    this.buttons = [];
    if (!tower) return;

    const x = CANVAS_WIDTH - 210;
    const y = 46;
    const nextRealm = tower.level < 5 ? REALMS[tower.level] : null;
    const refund = Math.floor(tower.totalInvested * 0.5);

    if (nextRealm) {
      this.buttons.push({
        x,
        y: y + 66,
        width: 190,
        height: 34,
        label: `突破 ${nextRealm.name}  (${nextRealm.cost}灵)`,
        onClick: () => {},
        color: '#f0833a',
        hoverColor: '#ffb74d',
        textColor: '#fff',
        fontSize: 14,
      });
    }

    this.buttons.push({
      x,
      y: y + 106,
      width: 190,
      height: 30,
      label: `出售  (${refund} 灵)`,
      onClick: () => {},
      color: '#e53935',
      hoverColor: '#ef5350',
      textColor: '#fff',
      fontSize: 14,
    });
  }

  get towerData(): Tower | null { return this.tower; }

  render(ctx: CanvasRenderingContext2D, mx: number, my: number): void {
    if (!this.tower) return;

    const x = CANVAS_WIDTH - 210;
    const y = 46;
    const realm = REALMS[this.tower.level - 1];

    // DB-style white panel with thick outline
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = this.tower.config.outlineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 14, 218, 168, 10);
    ctx.fill();
    ctx.stroke();

    // DB orange accent bar
    ctx.fillStyle = '#f0833a';
    ctx.fillRect(x - 14, y - 14, 218, 5);

    ctx.fillStyle = '#222';
    ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.tower.config.icon} ${this.tower.config.name}`, x, y + 14);

    ctx.fillStyle = '#555';
    ctx.font = '13px "Microsoft YaHei", sans-serif';
    ctx.fillText(`境界: ${realm.name}  Lv.${this.tower.level}`, x, y + 34);
    ctx.fillText(`伤害: ${this.tower.damage}  范围: ${this.tower.range}`, x, y + 52);

    for (const btn of this.buttons) renderButton(ctx, btn, mx, my);
  }

  getClickedButton(x: number, y: number): 'upgrade' | 'sell' | null {
    if (!this.tower) return null;
    if (this.buttons.length >= 2 && isInside(this.buttons[0], x, y)) return 'upgrade';
    if (isInside(this.buttons[this.buttons.length - 1], x, y)) return 'sell';
    return null;
  }
}
