'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/*
  Game-menu style interface sounds, synthesised live with the Web Audio API
  (original sounds, no files to download):
  - hover:  a short glassy tick when the pointer enters a link or button
  - select: a two-note confirm on click / tap
  - turn:   a soft swish when the page changes
  Browsers only allow sound after the visitor's first click or key press,
  so the very first hover is silent. A toggle (bottom-right) mutes it and
  the choice is remembered on that device.
*/

type Ctx = AudioContext;
const KEY = 'dt-sfx';

function readPref(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}
function writePref(on: boolean) {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* storage unavailable: keep it for this visit only */
  }
}

function blip(ctx: Ctx, out: AudioNode, t: number, f0: number, f1: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(ctx: Ctx, out: AudioNode, t: number, dur: number, gain: number, fromHz: number, toHz: number, q = 1.2) {
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = q;
  bp.frequency.setValueAtTime(fromHz, t);
  bp.frequency.exponentialRampToValueAtTime(toHz, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(out);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export default function SoundFX() {
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  const ctxRef = useRef<Ctx | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const lastHover = useRef<{ el: Element | null; t: number }>({ el: null, t: 0 });
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    const pref = readPref();
    setOn(pref);
    onRef.current = pref;
  }, []);

  const ensure = (): Ctx | null => {
    if (!onRef.current) return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const bus = ctx.createGain();
      bus.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      bus.connect(comp).connect(ctx.destination);
      ctxRef.current = ctx;
      busRef.current = bus;
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  };

  const play = (kind: 'hover' | 'select' | 'turn') => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!onRef.current || !ctx || !bus || ctx.state !== 'running') return;
    const t = ctx.currentTime + 0.005;
    const v = 1 + (Math.random() - 0.5) * 0.06; // tiny pitch variation so it never feels mechanical
    if (kind === 'hover') {
      blip(ctx, bus, t, 2600 * v, 1900 * v, 0.045, 0.06, 'sine');
      noise(ctx, bus, t, 0.03, 0.035, 6000, 9000, 2);
    } else if (kind === 'select') {
      blip(ctx, bus, t, 880 * v, 860 * v, 0.07, 0.09, 'triangle');
      blip(ctx, bus, t + 0.065, 1320 * v, 1300 * v, 0.12, 0.08, 'triangle');
      noise(ctx, bus, t, 0.08, 0.03, 2500, 7000, 1.5);
    } else {
      noise(ctx, bus, t, 0.32, 0.05, 450, 2600, 0.9);
      blip(ctx, bus, t + 0.05, 220, 330, 0.22, 0.03, 'sine');
    }
  };

  useEffect(() => {
    const unlock = () => {
      ensure();
    };
    const sel = 'a, button, [data-sfx]';
    const over = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // no hover sounds on touch screens
      const el = (e.target as Element | null)?.closest?.(sel) ?? null;
      if (!el || el === lastHover.current.el) return;
      const now = performance.now();
      lastHover.current = { el, t: now };
      play('hover');
    };
    const out = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(sel) ?? null;
      const to = (e.relatedTarget as Element | null)?.closest?.(sel) ?? null;
      if (el && el !== to) lastHover.current.el = null;
    };
    const click = (e: MouseEvent) => {
      ensure();
      const el = (e.target as Element | null)?.closest?.(sel);
      if (el && !(el as HTMLElement).dataset.sfxToggle) play('select');
    };
    const key = (e: KeyboardEvent) => {
      ensure();
      if (e.key === 'Tab') setTimeout(() => play('hover'), 0);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    window.addEventListener('click', click, { passive: true, capture: true });
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('click', click, { capture: true } as EventListenerOptions);
      window.removeEventListener('keydown', key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    play('turn');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggle = () => {
    const next = !onRef.current;
    onRef.current = next;
    setOn(next);
    writePref(next);
    if (next) {
      ensure();
      setTimeout(() => play('select'), 30);
    }
  };

  return (
    <button
      type="button"
      className={`sfx-toggle${on ? ' is-on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn interface sound off' : 'Turn interface sound on'}
      data-sfx-toggle="1"
    >
      <span className="sfx-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sfx-toggle__label">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
