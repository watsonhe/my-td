import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export interface HUDData {
  spirit: number;
  lives: number;
  wave: number;
  totalWaves: number;
  kills: number;
  gameSpeed: number;
}

export function renderHUD(ctx: CanvasRenderingContext2D, data: HUDData): void {
  const y = CANVAS_HEIGHT - 100;
  const panelHeight = 40;

  // Top info bar (during game)
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, 36);

  ctx.font = 'bold 16px sans-serif';
  ctx.textBaseline = 'middle';

  // Spirit
  ctx.fillStyle = '#f0c040';
  ctx.textAlign = 'left';
  ctx.fillText(`灵力: ${data.spirit}`, 12, 18);

  // Lives
  ctx.fillStyle = '#f06060';
  ctx.textAlign = 'left';
  ctx.fillText(`阵眼耐久: ${data.lives}`, 160, 18);

  // Wave
  ctx.fillStyle = '#c0c0f0';
  ctx.textAlign = 'left';
  const waveLabel = data.wave > 0 ? `妖魔潮: ${data.wave}/${data.totalWaves}` : '妖魔潮: 准备中...';
  ctx.fillText(waveLabel, 340, 18);

  // Speed
  ctx.fillStyle = '#a0a0a0';
  ctx.textAlign = 'right';
  ctx.fillText(`速度: x${data.gameSpeed}`, CANVAS_WIDTH - 12, 18);

  // Bottom panel background
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, y, CANVAS_WIDTH, panelHeight);
}
