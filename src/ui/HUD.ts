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
  // DB-style top bar: dark with accent stripe
  ctx.fillStyle = 'rgba(20,20,30,0.85)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, 36);

  // Orange accent line (Goku's gi color)
  ctx.fillStyle = '#f0833a';
  ctx.fillRect(0, 36, CANVAS_WIDTH, 3);

  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.textBaseline = 'middle';

  // Spirit
  ctx.fillStyle = '#ffd740';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ 灵力: ${data.spirit}`, 12, 18);

  // Lives
  ctx.fillStyle = '#ff5252';
  ctx.fillText(`❤ 阵眼: ${data.lives}`, 180, 18);

  // Wave (scouter-style)
  ctx.fillStyle = '#64b5f6';
  const waveLabel = data.wave > 0 ? `波 ${data.wave}/${data.totalWaves}` : '准备...';
  ctx.fillText(`⚔ ${waveLabel}`, 340, 18);

  // Music
  ctx.fillStyle = data.musicOn ? '#ccc' : '#666';
  ctx.textAlign = 'right';
  ctx.fillText(data.musicOn ? '♪' : '✕', CANVAS_WIDTH - 100, 18);

  // Speed (DB power level style)
  ctx.fillStyle = '#f0833a';
  ctx.fillText(`x${data.gameSpeed}`, CANVAS_WIDTH - 16, 18);

  // Bottom tower panel
  const bottomY = CANVAS_HEIGHT - 100;
  ctx.fillStyle = 'rgba(20,20,30,0.88)';
  ctx.fillRect(0, bottomY, CANVAS_WIDTH, 100);

  // DB orange accent on bottom panel
  ctx.fillStyle = '#f0833a';
  ctx.fillRect(0, bottomY, CANVAS_WIDTH, 3);
}

export function isMusicToggleClick(x: number, y: number): boolean {
  return y < 36 && x > CANVAS_WIDTH - 130 && x < CANVAS_WIDTH - 60;
}
