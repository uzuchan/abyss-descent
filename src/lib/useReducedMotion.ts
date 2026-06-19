'use client';

import { useEffect, useState } from 'react';
import { useAbyss } from './store';

/**
 * prefers-reduced-motion を購読し、ストアにも反映する。
 * 低モーション時は滑らかスクロール・揺れ・粒子ドリフト・動くノイズを止める。
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  const setReducedMotion = useAbyss((s) => s.setReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduced(mq.matches);
      setReducedMotion(mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [setReducedMotion]);

  return reduced;
}
