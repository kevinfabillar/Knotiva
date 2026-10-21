// Background music for invitations.
// `tune` is either an audio file URL (a client's song) or the name of a built-in synthesised piece.
// Built-in pieces are public-domain compositions played live by a small Web Audio music box,
// so there is no audio file to host and no licensing to worry about.

const SEMITONE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function freq(name) {
  const m = /^([A-G])(#|b)?(\d)$/.exec(name);
  const midi = (Number(m[3]) + 1) * 12 + SEMITONE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * 2 ** ((midi - 69) / 12);
}

// ---------- Pachelbel, Canon in D (public domain) ----------
// One cycle = 8 chords × 4 eighth notes. Later cycles add the famous descending violin lines.
const CANON_CHORDS = [
  { bass: 'D3', arp: ['D4', 'F#4', 'A4', 'F#4'] },
  { bass: 'A2', arp: ['C#4', 'E4', 'A4', 'E4'] },
  { bass: 'B2', arp: ['D4', 'F#4', 'B4', 'F#4'] },
  { bass: 'F#3', arp: ['C#4', 'F#4', 'A4', 'F#4'] },
  { bass: 'G2', arp: ['D4', 'G4', 'B4', 'G4'] },
  { bass: 'D3', arp: ['D4', 'F#4', 'A4', 'F#4'] },
  { bass: 'G2', arp: ['D4', 'G4', 'B4', 'G4'] },
  { bass: 'A2', arp: ['C#4', 'E4', 'A4', 'E4'] },
];
const CANON_LINES = [
  null,
  ['F#5', 'E5', 'D5', 'C#5', 'B4', 'A4', 'B4', 'C#5'],
  ['D5', 'C#5', 'B4', 'A4', 'G4', 'F#4', 'G4', 'E4'],
  ['A5', 'G5', 'F#5', 'E5', 'D5', 'C#5', 'D5', 'E5'],
];

// ---------- Reverie: slow maj7 sway in the manner of Satie's Gymnopédie No. 1 (public domain) ----------
const REVERIE_BARS = [
  { bass: 'G2', chord: ['B3', 'D4', 'F#4'] },
  { bass: 'D2', chord: ['A3', 'C#4', 'F#4'] },
];
const REVERIE_MELODY = [null, null, 'F#5', 'A5', 'G5', 'F#5', 'C#5', 'B4', 'C#5', 'D5', 'A4', 'F#4', null, null, null, null];

const TUNES = {
  canon: {
    step: 60 / 66 / 2, // eighth note at 66 bpm
    length: 32 * 4, // four cycles of the canon
    notes(step) {
      const cycle = Math.floor(step / 32) % 4;
      const inCycle = step % 32;
      const chord = CANON_CHORDS[Math.floor(inCycle / 4)];
      const beat = inCycle % 4;
      const out = [{ n: chord.arp[beat], v: beat === 0 ? 0.22 : 0.16, d: 1.9 }];
      if (beat === 0) out.push({ n: chord.bass, v: 0.3, d: 2.6 });
      const line = CANON_LINES[cycle];
      if (line && beat === 0) out.push({ n: line[Math.floor(inCycle / 4)], v: 0.26, d: 2.4 });
      return out;
    },
  },
  reverie: {
    step: 60 / 72, // one beat at 72 bpm, three beats to a bar
    length: 16 * 3,
    notes(step) {
      const bar = Math.floor(step / 3);
      const beat = step % 3;
      const harmony = REVERIE_BARS[bar % 2];
      const out = [];
      if (beat === 0) out.push({ n: harmony.bass, v: 0.3, d: 3.2 });
      if (beat === 1) harmony.chord.forEach((n) => out.push({ n, v: 0.11, d: 2.6 }));
      const melody = REVERIE_MELODY[bar % REVERIE_MELODY.length];
      if (melody && beat === 0) out.push({ n: melody, v: 0.24, d: 3.4 });
      return out;
    },
  },
};

function impulse(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c += 1) {
    const data = buf.getChannelData(c);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay;
  }
  return buf;
}

/** Live music-box synth playing one of the built-in tunes in a loop. */
class SynthEngine {
  constructor(name) {
    this.tune = TUNES[name] || TUNES.canon;
    this.ctx = null;
    this.timer = null;
  }

  setup() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 5200;
    const bus = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 0.82;
    const wet = ctx.createGain();
    wet.gain.value = 0.34;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx, 2.6, 2.4);
    bus.connect(dry).connect(tone);
    bus.connect(verb).connect(wet).connect(tone);
    tone.connect(master).connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.bus = bus;
    this.step = 0;
    this.next = ctx.currentTime + 0.12;
  }

  voice(name, at, vel, dur) {
    const { ctx, bus } = this;
    const f = freq(name);
    // A music-box tine: a pure fundamental plus quickly fading upper partials.
    [
      [1, vel, dur],
      [2, vel * 0.2, dur * 0.45],
      [3.01, vel * 0.06, dur * 0.22],
    ].forEach(([ratio, gain, len]) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f * ratio;
      env.gain.setValueAtTime(0.0001, at);
      env.gain.exponentialRampToValueAtTime(gain, at + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, at + len);
      osc.connect(env).connect(bus);
      osc.start(at);
      osc.stop(at + len + 0.05);
    });
  }

  tick = () => {
    const { ctx, tune } = this;
    while (this.next < ctx.currentTime + 0.3) {
      tune.notes(this.step % tune.length).forEach((x) => this.voice(x.n, this.next, x.v, x.d));
      this.next += tune.step;
      this.step += 1;
    }
  };

  play() {
    if (!this.ctx) this.setup();
    const { ctx, master } = this;
    ctx.resume();
    if (this.next < ctx.currentTime) this.next = ctx.currentTime + 0.08;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 1.6);
    clearInterval(this.timer);
    this.timer = setInterval(this.tick, 60);
    this.tick();
  }

  pause() {
    if (!this.ctx) return;
    const { ctx, master } = this;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
    clearInterval(this.timer);
    setTimeout(() => {
      if (!this.timer || this.paused) ctx.suspend();
    }, 400);
  }

  destroy() {
    clearInterval(this.timer);
    this.ctx?.close();
  }
}

/** A client's own song file. */
class FileEngine {
  constructor(src) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.7;
  }

  play() {
    return this.audio.play().catch(() => {});
  }

  pause() {
    this.audio.pause();
  }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
  }
}

/**
 * Music controller with play/pause state that React can subscribe to.
 * Call play() from inside a click handler so browsers allow the sound.
 */
export function createMusic(tune = 'canon') {
  const engine = /\.(mp3|m4a|ogg|wav)(\?|$)/i.test(tune) ? new FileEngine(tune) : new SynthEngine(tune);
  const listeners = new Set();
  let playing = false;
  let hiddenPause = false;

  const set = (v) => {
    playing = v;
    engine.paused = !v;
    listeners.forEach((fn) => fn(v));
  };

  const onVisibility = () => {
    if (document.hidden && playing) {
      hiddenPause = true;
      engine.pause();
    } else if (!document.hidden && hiddenPause) {
      hiddenPause = false;
      if (playing) engine.play();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    get playing() {
      return playing;
    },
    play() {
      try {
        engine.play();
        set(true);
      } catch {
        set(false);
      }
    },
    pause() {
      engine.pause();
      set(false);
    },
    toggle() {
      if (playing) this.pause();
      else this.play();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    destroy() {
      document.removeEventListener('visibilitychange', onVisibility);
      engine.destroy();
      listeners.clear();
    },
  };
}
