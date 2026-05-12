// Lightweight Web Audio API metronome + Tone.js preview.
// No globals — each hook instance gets its own AudioContext.

export class Metronome {
  private ctx: AudioContext | null = null;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private lookahead = 25; // ms
  private scheduleAheadTime = 0.1; // seconds
  private timerId: number | null = null;
  private bpm = 90;
  private onBeat: ((beat: number) => void) | null = null;

  setBpm(bpm: number) {
    this.bpm = bpm;
  }

  setOnBeat(cb: (beat: number) => void) {
    this.onBeat = cb;
  }

  start() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.currentBeat = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduler = () => {
    if (!this.ctx) return;
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleClick(this.currentBeat, this.nextNoteTime);
      const seconds = 60.0 / this.bpm;
      this.nextNoteTime += seconds;
      this.currentBeat = (this.currentBeat + 1) % 4;
    }
    this.timerId = window.setTimeout(this.scheduler, this.lookahead);
  };

  private scheduleClick(beat: number, time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Accent on beat 0
    const freq = beat === 0 ? 1500 : 900;
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(beat === 0 ? 0.4 : 0.25, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.06);

    // Beat-display callback via setTimeout (UI-only, not audio-critical)
    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    setTimeout(() => this.onBeat?.(beat), delayMs);
  }

  dispose() {
    this.stop();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}

// Exercise preview: real acoustic guitar samples (CC-licensed) via Tone.Sampler.
// Samples hosted at github.com/nbrosowsky/tonejs-instruments (CDN'd via gh-pages).
export type Note =
  | {
      pitch: string | string[];
      duration: string;
      time?: number;
      velocity?: number;
    }
  | { mute: true; duration: string; time?: number };

const GUITAR_BASE =
  "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/";

const GUITAR_SAMPLES: Record<string, string> = {
  A2: "A2.mp3",
  A3: "A3.mp3",
  A4: "A4.mp3",
  B2: "B2.mp3",
  B3: "B3.mp3",
  B4: "B4.mp3",
  C3: "C3.mp3",
  C4: "C4.mp3",
  C5: "C5.mp3",
  D2: "D2.mp3",
  D3: "D3.mp3",
  D4: "D4.mp3",
  D5: "D5.mp3",
  E2: "E2.mp3",
  E3: "E3.mp3",
  E4: "E4.mp3",
  F2: "F2.mp3",
  F3: "F3.mp3",
  F4: "F4.mp3",
  G2: "G2.mp3",
  G3: "G3.mp3",
  G4: "G4.mp3",
};

type CachedSampler = {
  // Using a loose type to avoid pulling in Tone types at module load
  sampler: unknown;
  ready: Promise<void>;
};

let cached: CachedSampler | null = null;

async function getGuitarSampler() {
  const Tone = await import("tone");
  if (cached) {
    await cached.ready;
    return { Tone, sampler: cached.sampler as InstanceType<typeof Tone.Sampler> };
  }
  let resolve!: () => void;
  const ready = new Promise<void>((r) => (resolve = r));
  const sampler = new Tone.Sampler({
    urls: GUITAR_SAMPLES,
    baseUrl: GUITAR_BASE,
    release: 1,
    onload: () => resolve(),
  }).toDestination();
  cached = { sampler, ready };
  await ready;
  return { Tone, sampler };
}

// Optional warmup so first click is instant
export function preloadGuitar() {
  if (typeof window === "undefined") return;
  void getGuitarSampler();
}

export async function playExercisePreview(
  notes: Note[],
  bpm: number,
  onEnd?: () => void
): Promise<() => void> {
  const { Tone, sampler } = await getGuitarSampler();
  await Tone.start();
  Tone.getTransport().bpm.value = bpm;

  // Percussive mute "chukka" sound — filtered noise burst
  const muteFilter = new Tone.Filter({
    frequency: 1200,
    type: "bandpass",
    Q: 1.2,
  }).toDestination();
  const muteSynth = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    volume: -16,
  }).connect(muteFilter);

  // Compute step duration per note for sequential timing
  const stepSeconds = (durSym: string): number => {
    const secs = Tone.Time(durSym).toSeconds();
    return secs;
  };

  let cursor = 0;
  const events = notes.map((n) => {
    const at = cursor;
    cursor += stepSeconds(n.duration);
    return { at, n };
  });

  const part = new Tone.Part(
    (time, value) => {
      const v = value as { n: Note };
      const note = v.n;
      if ("mute" in note) {
        muteSynth.triggerAttackRelease("32n", time);
      } else {
        sampler.triggerAttackRelease(
          note.pitch,
          note.duration,
          time,
          note.velocity ?? 0.9
        );
      }
    },
    events.map((e) => [e.at, e])
  );

  part.start(0);
  Tone.getTransport().start();

  const totalSeconds = cursor + 1.2;
  const timeout = setTimeout(() => {
    Tone.getTransport().stop();
    part.dispose();
    muteSynth.dispose();
    muteFilter.dispose();
    onEnd?.();
  }, totalSeconds * 1000);

  return () => {
    clearTimeout(timeout);
    Tone.getTransport().stop();
    part.dispose();
    muteSynth.dispose();
    muteFilter.dispose();
    onEnd?.();
  };
}
