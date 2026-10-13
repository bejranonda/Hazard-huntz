// Tiny synthesised sound kit (no audio files to download). Nothing plays
// until the first tap, because mobile browsers only unlock audio after a
// user gesture.

import { store } from './util.js';

let ctx = null;
let master = null;
let muted = store.get('muted', false);

export function unlockAudio() {
  if (muted) return;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  } catch { ctx = null; }
}

export const isMuted = () => muted;

export function setMuted(m) {
  muted = !!m;
  store.set('muted', muted);
  if (!muted) unlockAudio();
  else if (ctx && ctx.state === 'running') ctx.suspend();
}

function tone({ type = 'sine', from, to = from, dur = 0.15, gain = 0.3, delay = 0, attack = 0.005 }) {
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.2, gain = 0.25, freq = 900, q = 1.2, delay = 0, sweepTo = 300 }) {
  const t0 = ctx.currentTime + delay;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = q;
  bp.frequency.setValueAtTime(freq, t0);
  bp.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t0);
}

const SOUNDS = {
  tap() { tone({ from: 620, to: 380, dur: 0.07, gain: 0.18 }); },
  // The signature mud "squish": filtered noise sweeping down plus a soft thump.
  squish() {
    noise({ dur: 0.22, gain: 0.32, freq: 1400, sweepTo: 220, q: 2.2 });
    tone({ type: 'sine', from: 180, to: 70, dur: 0.18, gain: 0.25 });
  },
  sparkle() {
    [1046, 1318, 1568, 2093].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.22, gain: 0.12, delay: i * 0.06 }));
  },
  correct() { SOUNDS.squish(); setTimeout(() => SOUNDS.sparkle(), 90); },
  // Gentle, not a buzzer: a soft falling "boop".
  wrong() { tone({ type: 'sine', from: 330, to: 196, dur: 0.28, gain: 0.22 }); },
  decoy() { tone({ type: 'sine', from: 440, to: 392, dur: 0.12, gain: 0.14 }); },
  blub() { tone({ type: 'sine', from: 240, to: 520, dur: 0.12, gain: 0.16 }); tone({ type: 'sine', from: 200, to: 460, dur: 0.1, gain: 0.12, delay: 0.1 }); },
  sheet() { tone({ type: 'triangle', from: 520, to: 700, dur: 0.08, gain: 0.08 }); },
  fanfare() {
    [523, 659, 784, 1046].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.3, gain: 0.16, delay: i * 0.11 }));
  },
  // A perfect round: the fanfare, then a bright second phrase.
  fanfareBig() {
    SOUNDS.fanfare();
    [784, 1046, 1318, 1568, 2093].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.26, gain: 0.14, delay: 0.55 + i * 0.09 }));
  },
  // A low score: warm and short, never a "fail" sound.
  chime() {
    [523, 659, 784].forEach((f, i) => tone({ type: 'sine', from: f, dur: 0.34, gain: 0.13, delay: i * 0.14 }));
  },
  // Three right answers in a row: a quick rising run.
  combo() {
    [880, 1175, 1568].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.12, gain: 0.1, delay: i * 0.05 }));
  },
  // Water reaches the floor.
  splash() {
    noise({ dur: 0.45, gain: 0.26, freq: 900, sweepTo: 300, q: 0.9 });
    tone({ type: 'sine', from: 300, to: 120, dur: 0.3, gain: 0.14 });
  },
  // The last five seconds: a soft clock tick.
  tick() { tone({ type: 'square', from: 1200, to: 1100, dur: 0.035, gain: 0.05 }); },
};

export function play(name) {
  if (muted || !ctx || ctx.state !== 'running') return;
  try { SOUNDS[name]?.(); } catch { /* ignore audio errors */ }
}

// Vibration is Android-only (iOS Safari has none); keep patterns short.
export function haptic(pattern) {
  if (muted) return;
  try { navigator.vibrate?.(pattern); } catch { /* ignore */ }
}
