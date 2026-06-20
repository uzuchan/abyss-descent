'use client';

import { useEffect } from 'react';
import { useAbyss } from '@/lib/store';
import { LAYERS, layerBlend } from '@/lib/layers';
import { lerp } from '@/lib/math';

/**
 * UI 文字色（--ink-rgb）と縁取り（--halo-rgb）を深度で補間する。
 * 明るい地上では暗い文字＋明るい縁、暗い深部では明るい文字＋暗い縁。
 */
export default function InkController() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (progress: number) => {
      const { i, t } = layerBlend(progress);
      const a = LAYERS[i];
      const b = LAYERS[i + 1];
      const ink = a.ink.map((v, k) => Math.round(lerp(v, b.ink[k], t)));
      const halo = a.halo.map((v, k) => Math.round(lerp(v, b.halo[k], t)));
      root.style.setProperty('--ink-rgb', ink.join(','));
      root.style.setProperty('--halo-rgb', halo.join(','));
    };
    apply(useAbyss.getState().progress);
    return useAbyss.subscribe((s) => apply(s.progress));
  }, []);

  return null;
}
