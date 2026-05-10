import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export interface HUDData {
  spirit: number;
  lives: number;
  wave: number;
  totalWaves: number;
  kills: number;
  gameSpeed: number;
  musicOn: boolean;
}

export function renderHUD(ctx: CanvasRenderingContext2D, data: HUDData): void {
  // Top info bar
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
  ctx.fillText(`阵眼耐久: ${data.lives}`, 160, 18);

  // Wave
  ctx.fillStyle = '#c0c0f0';
  const waveLabel = data.wave > 0 ? `妖魔潮: ${data.wave}/${data.totalWaves}` : '妖魔潮: 准备中...';
  ctx.fillText(waveLabel, 340, 18);

  // Music toggle
  ctx.fillStyle = data.musicOn ? '#c0c0c0' : '#666';
  ctx.textAlign = 'right';
  ctx.fillText(data.musicOn ? '♪ 音乐' : '♪ 静音', CANVAS_WIDTH - 100, 18);

  // Speed
  ctx.fillStyle = '#a0a0a0';
  ctx.fillText(`速度: x${data.gameSpeed}`, CANVAS_WIDTH - 12, 18);

  // Bottom panel bg
  const bottomY = CANVAS_HEIGHT - 100;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, bottomY, CANVAS_WIDTH, 40);
}

export function isMusicToggleClick(x: number, y: number): boolean {
  return y < 36 && x > CANVAS_WIDTH - 130 && x < CANVAS_WIDTH - 60;
}
