type InstrumentType = 'flute' | 'zither' | 'bell' | 'pad' | 'drum';

interface TrackPattern {
  instrument: InstrumentType;
  notes: Note[];
  bpm: number;
  volume: number;
  offsetBars: number;
}

interface Note {
  degree: number;
  octave: number;
  duration: number;
  rest?: boolean;
}

interface MusicConfig {
  tracks: TrackPattern[];
  scaleRoot: number;
}

const PENTATONIC_RATIOS = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; // C D E G A

type MelodyNote = [number, number, number];

function m(notes: MelodyNote[]): Note[] {
  return notes.map(([degree, octave, duration]) => ({ degree, octave, duration, rest: degree < 0 }));
}

// ── Level 1: 翠竹峰 — light bamboo flute, gentle but rhythmic ──
const L1_MELODY: MelodyNote[] = [
  [0, 4, 0.5], [2, 4, 0.5], [3, 4, 1], [2, 4, 0.5], [0, 4, 1.5],
  [4, 3, 0.5], [0, 4, 0.5], [1, 4, 1], [0, 4, 0.5], [4, 3, 1.5],
  [2, 4, 0.5], [3, 4, 0.5], [4, 4, 1], [3, 4, 0.5], [2, 4, 1], [0, 4, 0.5],
  [1, 4, 0.5], [2, 4, 0.5], [1, 4, 0.5], [0, 4, 1], [4, 3, 0.5], [3, 3, 1],
];
const L1_BASS: MelodyNote[] = [
  [0, 3, 2], [0, 3, 2], [2, 3, 2], [2, 3, 2],
  [4, 2, 2], [4, 2, 2], [0, 3, 2], [0, 3, 2],
];
const L1_DRUM: MelodyNote[] = [
  [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 1],
  [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 1],
];

// ── Level 2: 幽冥峡谷 — flowing zither + flute duet ──
const L2_MELODY: MelodyNote[] = [
  [4, 3, 0.5], [0, 4, 0.5], [1, 4, 0.5], [2, 4, 1], [0, 4, 0.5], [3, 4, 0.5], [2, 4, 1.5],
  [1, 4, 0.5], [2, 4, 0.5], [3, 4, 0.5], [4, 4, 1], [3, 4, 0.5], [2, 4, 0.5], [1, 4, 1.5],
  [2, 4, 0.5], [3, 4, 0.5], [0, 5, 1], [4, 4, 0.5], [3, 4, 0.5], [2, 4, 1.5],
  [0, 4, 0.5], [2, 4, 0.5], [3, 5, 0.5], [4, 5, 1], [3, 5, 0.5], [0, 5, 0.5], [1, 5, 2],
];
const L2_BASS: MelodyNote[] = [
  [0, 3, 1], [2, 3, 1], [3, 3, 1], [2, 3, 1],
  [4, 2, 1], [4, 2, 1], [0, 3, 1], [0, 3, 1],
  [0, 3, 1], [2, 3, 1], [3, 3, 1], [2, 3, 1],
  [4, 2, 1], [4, 2, 1], [0, 3, 1], [0, 3, 1],
];
const L2_DRUM: MelodyNote[] = [
  [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5],
  [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5],
];

// ── Level 3: 魔渊深处 — heroic, driving, full ensemble ──
const L3_MELODY: MelodyNote[] = [
  [0, 3, 0.5], [2, 3, 0.5], [3, 3, 0.5], [4, 3, 0.5], [0, 4, 0.5], [2, 4, 0.5], [3, 4, 0.5], [4, 4, 0.5],
  [4, 4, 0.5], [3, 4, 0.5], [0, 4, 0.5], [4, 3, 0.5], [3, 3, 0.5], [2, 3, 1.5],
  [0, 4, 0.5], [1, 4, 0.5], [2, 4, 0.5], [3, 4, 0.5], [4, 4, 1], [3, 4, 0.5], [0, 5, 0.5], [4, 4, 0.5],
  [3, 4, 0.5], [2, 4, 0.5], [0, 4, 0.5], [3, 4, 0.5], [2, 4, 0.5], [1, 4, 0.5], [2, 4, 1.5],
  [3, 4, 0.5], [4, 4, 0.5], [0, 5, 0.5], [3, 5, 0.5], [2, 5, 0.5], [0, 5, 0.5], [4, 4, 0.5], [3, 4, 1.5],
];
const L3_BASS: MelodyNote[] = [
  [0, 3, 1], [2, 3, 1], [4, 2, 1], [2, 3, 1],
  [0, 3, 1], [2, 3, 1], [4, 2, 1], [4, 2, 1],
  [0, 2, 1], [0, 2, 1], [0, 2, 1], [0, 2, 1],
  [4, 3, 1], [2, 3, 1], [0, 3, 1], [0, 3, 1],
];
const L3_DRUM: MelodyNote[] = [
  [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5],
  [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5],
  [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5],
  [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 1], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5], [-1, 0, 0.5],
];
const L3_HARMONY: MelodyNote[] = [
  [0, 4, 8], [2, 4, 8], [4, 3, 8], [0, 4, 8],
];

const LEVEL_MUSIC: MusicConfig[] = [
  {
    scaleRoot: 261.63,
    tracks: [
      { instrument: 'flute', notes: m(L1_MELODY), bpm: 96, volume: 0.28, offsetBars: 0 },
      { instrument: 'zither', notes: m(L1_BASS), bpm: 96, volume: 0.10, offsetBars: 0 },
      { instrument: 'drum', notes: m(L1_DRUM), bpm: 96, volume: 0.06, offsetBars: 0 },
    ],
  },
  {
    scaleRoot: 293.66,
    tracks: [
      { instrument: 'flute', notes: m(L2_MELODY), bpm: 110, volume: 0.25, offsetBars: 0 },
      { instrument: 'zither', notes: m(L2_BASS), bpm: 110, volume: 0.12, offsetBars: 0 },
      { instrument: 'drum', notes: m(L2_DRUM), bpm: 110, volume: 0.08, offsetBars: 0 },
    ],
  },
  {
    scaleRoot: 261.63,
    tracks: [
      { instrument: 'flute', notes: m(L3_MELODY), bpm: 130, volume: 0.22, offsetBars: 0 },
      { instrument: 'zither', notes: m(L3_BASS), bpm: 130, volume: 0.10, offsetBars: 0 },
      { instrument: 'bell', notes: m(L3_HARMONY), bpm: 130, volume: 0.08, offsetBars: 0 },
      { instrument: 'drum', notes: m(L3_DRUM), bpm: 130, volume: 0.10, offsetBars: 0 },
      { instrument: 'pad', notes: m([[0, 2, 16]]), bpm: 130, volume: 0.05, offsetBars: 0 },
    ],
  },
];

const MENU_MUSIC: MusicConfig = {
  scaleRoot: 261.63,
  tracks: [
    {
      instrument: 'flute',
      notes: m([
        [0, 4, 0.5], [2, 4, 0.5], [3, 4, 1], [2, 4, 0.5], [0, 4, 1.5],
        [4, 3, 0.5], [0, 4, 0.5], [1, 4, 1], [0, 4, 0.5], [4, 3, 1.5],
        [2, 4, 0.5], [3, 4, 0.5], [4, 4, 1], [3, 4, 0.5], [2, 4, 1], [0, 4, 0.5],
        [1, 4, 0.5], [2, 4, 0.5], [1, 4, 0.5], [0, 4, 1], [4, 3, 0.5], [3, 3, 1],
      ]),
      bpm: 80,
      volume: 0.25,
      offsetBars: 0,
    },
    {
      instrument: 'zither',
      notes: m([[0, 3, 4], [2, 3, 4], [4, 2, 4], [0, 3, 4]]),
      bpm: 80,
      volume: 0.08,
      offsetBars: 0,
    },
    {
      instrument: 'drum',
      notes: m([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]),
      bpm: 80,
      volume: 0.04,
      offsetBars: 0,
    },
  ],
};

export class MusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private running = false;
  private timerIds: number[] = [];
  private activeOscs: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.55;
    this.masterGain.connect(this.ctx.destination);
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === 'suspended') await this.ctx.resume();
  }

  playLevel(levelIndex: number): void {
    this.stop();
    const config = LEVEL_MUSIC[levelIndex] ?? LEVEL_MUSIC[0];
    this.startConfig(config);
  }

  playMenu(): void {
    this.stop();
    this.startConfig(MENU_MUSIC);
  }

  stop(): void {
    this.running = false;
    for (const id of this.timerIds) clearTimeout(id);
    this.timerIds = [];
    for (const n of this.activeOscs) {
      try { n.stop(); } catch (_) { /* ok */ }
    }
    for (const g of this.activeGains) {
      g.gain.cancelScheduledValues(0);
    }
    this.activeOscs = [];
    this.activeGains = [];
  }

  setMasterVolume(v: number): void {
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  private startConfig(config: MusicConfig): void {
    if (!this.ctx || !this.masterGain) return;
    this.running = true;
    for (const track of config.tracks) {
      this.playTrack(config, track);
    }
  }

  private playTrack(config: MusicConfig, track: TrackPattern): void {
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;

    const { instrument, notes, bpm, volume, offsetBars } = track;
    const beatSec = 60 / bpm;
    const totalBeats = notes.reduce((s, n) => s + n.duration, 0);

    const loopNotes = () => {
      if (!this.running) return;
      let t = ctx.currentTime + offsetBars * 4 * beatSec;
      for (const note of notes) {
        if (!this.running) return;
        const dur = note.duration * beatSec;
        if (!note.rest && note.degree >= 0) {
          const freq = config.scaleRoot * PENTATONIC_RATIOS[note.degree % 5] * Math.pow(2, note.octave - 4);
          this.scheduleNote(instrument, freq, t, dur * 0.85, volume);
        }
        t += dur;
      }
    };

    loopNotes();
    const id = window.setInterval(loopNotes, totalBeats * beatSec * 1000);
    this.timerIds.push(id);
  }

  private scheduleNote(
    instrument: InstrumentType,
    freq: number,
    start: number,
    dur: number,
    vol: number,
  ): void {
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;

    if (instrument === 'drum') {
      this.scheduleDrum(start, dur, vol);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    switch (instrument) {
      case 'flute': osc.type = 'sine'; break;
      case 'zither': osc.type = 'triangle'; break;
      case 'bell': osc.type = 'sine'; break;
      case 'pad': osc.type = 'sawtooth'; break;
    }
    osc.frequency.value = freq;

    const attack = instrument === 'pad' ? 0.15 : 0.01;
    const release = dur * 0.25;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + attack);
    gain.gain.setValueAtTime(vol, start + dur - release);
    gain.gain.linearRampToValueAtTime(0, start + dur);

    // Flute vibrato
    if (instrument === 'flute') {
      const v = ctx.createOscillator();
      const vg = ctx.createGain();
      v.frequency.value = 5.5;
      vg.gain.value = 2.5;
      v.connect(vg);
      vg.connect(osc.frequency);
      v.start(start);
      v.stop(start + dur);
    }

    // Bell harmonic
    if (instrument === 'bell') {
      const h = ctx.createOscillator();
      const hg = ctx.createGain();
      h.type = 'sine';
      h.frequency.value = freq * 2.76;
      hg.gain.setValueAtTime(0, start);
      hg.gain.linearRampToValueAtTime(vol * 0.25, start + 0.01);
      hg.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.4);
      h.connect(hg);
      hg.connect(gain);
      h.start(start);
      h.stop(start + dur);
    }

    // Pad lowpass
    if (instrument === 'pad') {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 400;
      osc.connect(f);
      f.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.05);

    this.activeOscs.push(osc);
    this.activeGains.push(gain);

    const cleanAt = (start + dur + 0.1 - ctx.currentTime) * 1000;
    const tid = window.setTimeout(() => {
      const i = this.activeOscs.indexOf(osc);
      if (i >= 0) this.activeOscs.splice(i, 1);
      const j = this.activeGains.indexOf(gain);
      if (j >= 0) this.activeGains.splice(j, 1);
    }, Math.max(0, cleanAt));
    this.timerIds.push(tid);
  }

  private scheduleDrum(start: number, dur: number, vol: number): void {
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || !master) return;

    // Short noise burst for percussion
    const bufSize = ctx.sampleRate * 0.05;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 8);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.5, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(start);
    src.stop(start + 0.06);
  }
}

export const musicPlayer = new MusicPlayer();
