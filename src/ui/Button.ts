export interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
  textColor?: string;
  fontSize?: number;
  visible?: boolean;
  enabled?: boolean;
}

export function renderButton(ctx: CanvasRenderingContext2D, btn: Button, mouseX: number, mouseY: number): void {
  if (btn.visible === false) return;

  const hovering = isInside(btn, mouseX, mouseY);
  const enabled = btn.enabled !== false;

  // DB shadow
  ctx.save();
  if (enabled) {
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = hovering ? 10 : 5;
    ctx.shadowOffsetY = 4;
  }

  const fillColor = enabled
    ? (hovering ? (btn.hoverColor ?? DB_lighten(btn.color ?? '#f0833a')) : (btn.color ?? '#f0833a'))
    : '#888';
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 10);
  ctx.fill();
  ctx.restore();

  // DB thick outline on hover
  if (hovering && enabled) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 10);
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = enabled ? (btn.textColor ?? '#fff') : '#bbb';
  ctx.font = `bold ${btn.fontSize ?? 18}px "Microsoft YaHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 1;
  ctx.shadowOffsetY = 1;

  const lines = btn.label.split('\n');
  const lh = (btn.fontSize ?? 18) + 3;
  const th = lines.length * lh;
  const sy = btn.y + btn.height / 2 - th / 2 + lh / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], btn.x + btn.width / 2, sy + i * lh);
  }
  ctx.shadowColor = 'transparent';
}

function DB_lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const l = (c: number) => Math.min(255, c + 40);
  return `#${l(r).toString(16).padStart(2, '0')}${l(g).toString(16).padStart(2, '0')}${l(b).toString(16).padStart(2, '0')}`;
}

export function isInside(btn: Button, x: number, y: number): boolean {
  return x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height;
}

export function handleButtonClick(buttons: Button[], x: number, y: number): void {
  for (const btn of buttons) {
    if (btn.enabled !== false && btn.visible !== false && isInside(btn, x, y)) {
      btn.onClick();
      return;
    }
  }
}
