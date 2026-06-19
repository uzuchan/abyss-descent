'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { useAbyss } from './store';

/**
 * スクロール進捗 0..1 をストアへ供給する。
 * 通常は Lenis（滑らかスクロール）を GSAP の ticker で駆動。
 * 低モーション時は Lenis を使わずネイティブ scroll から算出。
 */
export function useScrollProgress(reduced: boolean) {
  const setScroll = useAbyss((s) => s.setScroll);

  useEffect(() => {
    if (reduced) {
      const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setScroll(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }

    // Lenis ＋ GSAP ticker（公式推奨の統合）
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', (e: Lenis) => setScroll(e.progress));

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reduced, setScroll]);
}
