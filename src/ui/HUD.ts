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
  // Top bar with gradient
  const barGrad = ctx.createLinearGradient(0, 0, 0, 36);
  barGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
  barGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 38);

  // Bottom border accent
  ctx.fillStyle = '#ffb74d';
  ctx.fillRect(0, 38, CANVAS_WIDTH, 2);

  ctx.font = 'bold 15px "Microsoft YaHei", sans-serif';
  ctx.textBaseline = 'middle';

  // Spirit — gold coin style
  ctx.fillStyle = '#ffd740';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ 灵力: ${data.spirit}`, 12, 19);

  // Lives — heart style
  ctx.fillStyle = '#ff5252';
  ctx.fillText(`❤ 阵眼: ${data.lives}`, 175, 19);

  // Wave number
  ctx.fillStyle = '#64b5f6';
  const waveLabel = data.wave > 0 ? `⚔ 妖魔潮: ${data.wave}/${data.totalWaves}` : '⏳ 准备中...';
  ctx.fillText(waveLabel, 350, 19);

  // Music
  ctx.fillStyle = data.musicOn ? '#bdbdbd' : '#757575';
  ctx.textAlign = 'right';
  ctx.fillText(data.musicOn ? '♪ 音乐' : '♪ 静音', CANVAS_WIDTH - 100, 19);

  // Speed badge
  ctx.fillStyle = '#ffb74d';
  ctx.fillText(`▶ x${data.gameSpeed}`, CANVAS_WIDTH - 12, 19);

  // Bottom tower panel area background
  const bottomY = CANVAS_HEIGHT - 100;
  const bottomGrad = ctx.createLinearGradient(0, bottomY, 0, CANVAS_HEIGHT);
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
  bottomGrad.addColorStop(1, 'rgba(0,0,0,0.75)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, bottomY, CANVAS_WIDTH, 100);

  // Top accent line on bottom panel
  ctx.fillStyle = '#ff7043';
  ctx.fillRect(0, bottomY, CANVAS_WIDTH, 3);
}

export function isMusicToggleClick(x: number, y: number): boolean {
  return y < 38 && x > CANVAS_WIDTH - 130 && x < CANVAS_WIDTH - 60;
}
