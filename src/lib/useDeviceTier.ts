'use client';

import { useEffect, useState } from 'react';

export interface DeviceTier {
  isMobile: boolean;
  dpr: [number, number]; // R3F Canvas の DPR クランプ
  sporeCount: number; // 粒子数
  giants: number; // 巨大シルエット数
}

const DESKTOP: DeviceTier = { isMobile: false, dpr: [1, 1.75], sporeCount: 1400, giants: 3 };
const MOBILE: DeviceTier = { isMobile: true, dpr: [1, 1.25], sporeCount: 500, giants: 1 };

/** 画面幅・ポインタ種別から軽量化ティアを判定（スマホ軽量化） */
export function useDeviceTier(): DeviceTier {
  // SSR では保守的に MOBILE 相当を返し、マウント後に確定。
  const [tier, setTier] = useState<DeviceTier>(MOBILE);

  useEffect(() => {
    const detect = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const narrow = window.innerWidth < 768;
      setTier(coarse || narrow ? MOBILE : DESKTOP);
    };
    detect();
    window.addEventListener('resize', detect, { passive: true });
    return () => window.removeEventListener('resize', detect);
  }, []);

  return tier;
}
