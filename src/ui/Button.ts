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

  // Drop shadow
  ctx.save();
  if (enabled) {
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = hovering ? 8 : 4;
    ctx.shadowOffsetY = 3;
  }

  // Button fill
  const fillColor = enabled
    ? (hovering ? (btn.hoverColor ?? lighten(btn.color ?? '#ff6d3a')) : (btn.color ?? '#ff6d3a'))
    : '#9e9e9e';
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 10);
  ctx.fill();
  ctx.restore();

  // Outline
  if (hovering && enabled) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 10);
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = enabled ? (btn.textColor ?? '#fff') : '#ccc';
  ctx.font = `bold ${btn.fontSize ?? 18}px "Microsoft YaHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = btn.label.split('\n');
  const lineH = (btn.fontSize ?? 18) + 3;
  const totalH = lines.length * lineH;
  const startY = btn.y + btn.height / 2 - totalH / 2 + lineH / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], btn.x + btn.width / 2, startY + i * lineH);
  }
}

function lighten(hex: string): string {
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
