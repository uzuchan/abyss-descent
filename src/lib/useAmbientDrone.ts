'use client';

import { useEffect, useRef } from 'react';
import { useAbyss } from './store';
import { clamp } from './math';

interface DroneNodes {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
}

/**
 * 環境ドローン（WebAudio）。アセット不要・合成音。
 * soundOn=true（ユーザー操作）で起動し、深度でピッチとフィルタが変化する。
 * 深いほど低く・籠った音になる。
 */
export function useAmbientDrone() {
  const soundOn = useAbyss((s) => s.soundOn);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<DroneNodes | null>(null);

  useEffect(() => {
    if (!soundOn) return;

    const Ctx: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    void ctx.resume();
    ctxRef.current = ctx;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 68;
    osc2.frequency.value = 68.4; // わずかなデチューンでうねり

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5); // 静かにフェードイン

    nodesRef.current = { osc1, osc2, filter, gain };

    // 深度に応じてピッチ・フィルタを連続変化
    const unsub = useAbyss.subscribe((s) => {
      const c = ctxRef.current;
      const n = nodesRef.current;
      if (!c || !n) return;
      const p = clamp(s.progress);
      const base = 70 - p * 36; // 70Hz → 34Hz
      const t = c.currentTime;
      n.osc1.frequency.setTargetAtTime(base, t, 0.4);
      n.osc2.frequency.setTargetAtTime(base * 1.006, t, 0.4);
      n.filter.frequency.setTargetAtTime(620 - p * 470, t, 0.4); // 深いほど籠る
    });

    return () => {
      unsub();
      const c = ctxRef.current;
      const n = nodesRef.current;
      if (c && n) {
        const t = c.currentTime;
        n.gain.gain.cancelScheduledValues(t);
        n.gain.gain.setTargetAtTime(0, t, 0.4);
        setTimeout(() => {
          try {
            n.osc1.stop();
            n.osc2.stop();
            void c.close();
          } catch {
            /* already closed */
          }
        }, 900);
      }
      ctxRef.current = null;
      nodesRef.current = null;
    };
  }, [soundOn]);
}
