type InstrumentType = 'flute' | 'zither' | 'bell' | 'pad';

interface Note {
  degree: number;   // 0-4 index into pentatonic scale
  octave: number;   // 3=low, 4=mid, 5=high
  duration: number; // beats
  rest?: boolean;
}

interface TrackPattern {
  instrument: InstrumentType;
  notes: Note[];
  bpm: number;
  volume: number;
  offsetBars: number; // start after N bars
}

interface MusicConfig {
  tracks: TrackPattern[];
  scaleRoot: number; // frequency of root note (C)
}

// Pentatonic scale degrees relative to root
const PENTATONIC_RATIOS = [1, 9/8, 5/4, 3/2, 5/3]; // C D E G A

// Distinct Chinese melodies built on pentatonic scale
// Each melody is an array of [degree, octave, beats]
type MelodyNote = [number, number, number]; // degree, octave, duration (beats)

const MELODY_GENTLE: MelodyNote[] = [
  [0,4,2], [1,4,1], [2,4,2], [1,4,1], [0,4,2], [4,3,1], [0,4,3],
  [1,4,1], [2,4,2], [3,4,1], [2,4,1], [1,4,2], [0,4,1], [4,3,2],
  [0,4,2], [3,4,1], [2,4,2], [3,4,1], [4,4,2], [3,4,1], [2,4,3],
  [1,4,1], [0,4,2], [2,4,1], [1,4,1], [2,4,1], [4,4,3], [0,4,4],
];

const MELODY_FLOWING: MelodyNote[] = [
  [4,3,1], [0,4,1], [1,4,1], [2,4,2], [0,4,1], [3,4,1], [2,4,2],
  [1,4,1], [2,4,1], [3,4,1], [4,4,2], [3,4,1], [2,4,1], [1,4,2],
  [2,4,1], [3,4,1], [0,5,2], [4,4,1], [3,4,1], [2,4,2],
  [0,4,1], [2,4,1], [3,5,1], [4,5,2], [3,5,1], [0,5,1], [2,5,1], [1,5,2],
];

const MELODY_HEROIC: MelodyNote[] = [
  [0,3,1], [2,3,1], [3,3,1], [4,3,1], [0,4,1], [2,4,1], [3,4,1], [4,4,1],
  [4,4,1], [3,4,1], [0,4,1], [4,3,1], [3,3,1], [2,3,2],
  [0,4,1], [1,4,1], [2,4,1], [3,4,1], [4,4,2], [3,4,1], [0,5,1], [4,4,1],
  [3,4,1], [2,4,1], [0,4,1], [3,4,1], [2,4,1], [1,4,1], [2,4,2],
  [3,4,1], [4,4,1], [0,5,1], [3,5,1], [2,5,1], [0,5,1], [4,4,1], [3,4,2],
];

const BASS_LINE: MelodyNote[] = [
  [0,3,4], [0,3,4],
  [2,3,4], [2,3,4],
  [4,2,4], [4,2,4],
  [0,3,4], [0,3,4],
];

const PERCUSSION_PATTERN: MelodyNote[] = [
  [-1,0,1], [-1,0,1], [-1,0,1], [-1,0,1],
  [-1,0,1], [-1,0,1], [-1,0,1], [-1,0,1],
];

function melodyToNotes(melody: MelodyNote[]): Note[] {
  return melody.map(([degree, octave, duration]) => ({
    degree,
    octave,
    duration,
    rest: degree < 0,
  }));
}

// Level music configurations: builds from gentle to heroic
const LEVEL_MUSIC: MusicConfig[] = [
  // Level 1: 翠竹峰 — single flute, gentle, slow tempo
  {
    scaleRoot: 261.63, // C4
    tracks: [
      {
        instrument: 'flute',
        notes: melodyToNotes(MELODY_GENTLE),
        bpm: 52,
        volume: 0.35,
        offsetBars: 0,
      },
    ],
  },
  // Level 2: 幽冥峡谷 — flute + zither, medium tempo
  {
    scaleRoot: 293.66, // D4
    tracks: [
      {
        instrument: 'flute',
        notes: melodyToNotes(MELODY_FLOWING),
        bpm: 68,
        volume: 0.30,
        offsetBars: 0,
      },
      {
        instrument: 'zither',
        notes: melodyToNotes(BASS_LINE),
        bpm: 68,
        volume: 0.15,
        offsetBars: 0,
      },
    ],
  },
  // Level 3: 魔渊深处 — full ensemble, fast tempo, intense
  {
    scaleRoot: 261.63, // C4
    tracks: [
      {
        instrument: 'flute',
        notes: melodyToNotes(MELODY_HEROIC),
        bpm: 80,
        volume: 0.25,
        offsetBars: 0,
      },
      {
        instrument: 'zither',
        notes: melodyToNotes(BASS_LINE.map(([d, o, b]) => [d, o, b > 1 ? b/2 : b] as MelodyNote)),
        bpm: 80,
        volume: 0.12,
        offsetBars: 0,
      },
      {
        instrument: 'bell',
        notes: melodyToNotes(BASS_LINE.map(([d, o, b]) => [d, o+1, b*2] as MelodyNote)),
        bpm: 80,
        volume: 0.10,
        offsetBars: 2,
      },
      {
        instrument: 'pad',
        notes: melodyToNotes([
          [0,2,16],
        ]),
        bpm: 80,
        volume: 0.06,
        offsetBars: 0,
      },
    ],
  },
];

// Menu music
const MENU_MUSIC: MusicConfig = {
  scaleRoot: 261.63,
  tracks: [
    {
      instrument: 'flute',
      notes: melodyToNotes([
        [0,4,1], [2,4,1], [3,4,2], [2,4,1], [0,4,3],
        [4,3,1], [0,4,1], [1,4,2], [0,4,1], [4,3,3],
        [2,4,1], [3,4,1], [4,4,2], [3,4,1], [2,4,2], [0,4,2],
        [2,4,1], [1,4,1], [0,4,2], [1,4,1], [2,4,1], [4,3,2], [0,4,2],
      ]),
      bpm: 48,
      volume: 0.3,
      offsetBars: 0,
    },
    {
      instrument: 'zither',
      notes: melodyToNotes([
        [0,3,8], [2,3,8],
      ]),
      bpm: 48,
      volume: 0.10,
      offsetBars: 0,
    },
  ],
};

export class MusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: OscillatorNode[] = [];
  private activeGains: GainNode[] = [];
  private running = false;
  private timeoutIds: number[] = [];
  private levelIndex = 0;

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.ctx.destination);
  }

  async resume(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  playLevel(levelIndex: number): void {
    this.stop();
    this.levelIndex = levelIndex;
    const config = levelIndex < LEVEL_MUSIC.length ? LEVEL_MUSIC[levelIndex] : LEVEL_MUSIC[0];
    this.startConfig(config);
  }

  playMenu(): void {
    this.stop();
    this.startConfig(MENU_MUSIC);
  }

  stop(): void {
    this.running = false;
    for (const id of this.timeoutIds) clearTimeout(id);
    this.timeoutIds = [];
    for (const node of this.activeNodes) {
      try { node.stop(); } catch (_) { /* already stopped */ }
    }
    for (const gain of this.activeGains) {
      gain.gain.cancelScheduledValues(0);
    }
    this.activeNodes = [];
    this.activeGains = [];
  }

  private startConfig(config: MusicConfig): void {
    if (!this.ctx || !this.masterGain) return;
    this.running = true;

    for (const track of config.tracks) {
      this.playTrack(config, track);
    }
  }

  private playTrack(config: MusicConfig, track: TrackPattern): void {
    if (!this.ctx || !this.masterGain || !this.running) return;

    const { instrument, notes, bpm, volume, offsetBars } = track;
    const beatDuration = 60 / bpm;
    const totalBeats = notes.reduce((sum, n) => sum + n.duration, 0);
    const loopDuration = totalBeats * beatDuration * 1000;
    const barBeats = 4;
    const offsetMs = offsetBars * barBeats * beatDuration * 1000;

    const scheduleNotes = () => {
      if (!this.ctx || !this.masterGain || !this.running) return;

      let time = this.ctx.currentTime + offsetMs / 1000;
      for (const note of notes) {
        if (!this.running) break;

        if (!note.rest && note.degree >= 0) {
          const freq = config.scaleRoot * PENTATONIC_RATIOS[note.degree % 5] * Math.pow(2, note.octave - 4);
          const noteDuration = note.duration * beatDuration;
          this.playNote(instrument, freq, time, noteDuration * 0.85, volume);
        }
        time += note.duration * beatDuration;
      }
    };

    scheduleNotes();

    if (this.running) {
      const id = window.setInterval(() => {
        if (this.running) scheduleNotes();
      }, loopDuration);
      this.timeoutIds.push(id);
    }
  }

  private playNote(
    instrument: InstrumentType,
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
  ): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Instrument character
    switch (instrument) {
      case 'flute':
        osc.type = 'sine';
        break;
      case 'zither':
        osc.type = 'triangle';
        break;
      case 'bell':
        osc.type = 'sine';
        break;
      case 'pad':
        osc.type = 'sawtooth';
        break;
    }

    osc.frequency.value = freq;

    // Volume envelope: gentle attack, natural decay
    const attackTime = instrument === 'pad' ? 0.3 : 0.02;
    const releaseTime = duration * 0.3;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + attackTime);
    gain.gain.setValueAtTime(volume, startTime + duration - releaseTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    // Add gentle vibrato for flute
    if (instrument === 'flute') {
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.value = 5;
      vibratoGain.gain.value = 3;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(startTime);
      vibrato.stop(startTime + duration);
    }

    // Bell: add harmonic
    if (instrument === 'bell') {
      const harm = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harm.type = 'sine';
      harm.frequency.value = freq * 2.76; // high harmonic
      harmGain.gain.setValueAtTime(0, startTime);
      harmGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.01);
      harmGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.5);
      harm.connect(harmGain);
      harmGain.connect(gain);
      harm.start(startTime);
      harm.stop(startTime + duration);
    }

    // Pad: add filter for warmth
    if (instrument === 'pad') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    this.activeNodes.push(osc);
    this.activeGains.push(gain);

    // Cleanup
    const cleanTime = (startTime + duration + 0.2) * 1000;
    const id = window.setTimeout(() => {
      const oi = this.activeNodes.indexOf(osc);
      if (oi !== -1) this.activeNodes.splice(oi, 1);
      const gi = this.activeGains.indexOf(gain);
      if (gi !== -1) this.activeGains.splice(gi, 1);
    }, Math.max(0, cleanTime - this.ctx.currentTime * 1000));
    this.timeoutIds.push(id);
  }

  setMasterVolume(v: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = v;
    }
  }
}

export const musicPlayer = new MusicPlayer();
