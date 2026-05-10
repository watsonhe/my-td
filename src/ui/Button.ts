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

  ctx.fillStyle = enabled
    ? (hovering ? (btn.hoverColor ?? '#5a8a5a') : (btn.color ?? '#4a6a4a'))
    : '#555';
  ctx.strokeStyle = hovering && enabled ? '#fff' : '#888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(btn.x, btn.y, btn.width, btn.height, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = enabled ? (btn.textColor ?? '#f0e0c0') : '#777';
  ctx.font = `${btn.fontSize ?? 18}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = btn.label.split('\n');
  const lineHeight = (btn.fontSize ?? 18) + 2;
  const totalHeight = lines.length * lineHeight;
  const startY = btn.y + btn.height / 2 - totalHeight / 2 + lineHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], btn.x + btn.width / 2, startY + i * lineHeight);
  }
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
