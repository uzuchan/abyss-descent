'use client';

import { useEffect, useRef } from 'react';
import { useAbyss } from '@/lib/store';

// feTurbulence によるフィルムグレイン（アセット不要）
const NOISE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='120'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.85'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'%20opacity='0.55'/%3E%3C/svg%3E";

/** 深度連動のノイズ（グレイン）＋ヴィネット。深いほど濃くなる。低モーションで静止。 */
export default function GrainOverlay() {
  const grain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (p: number) => {
      if (grain.current) grain.current.style.opacity = String(0.04 + p * 0.24);
    };
    apply(useAbyss.getState().progress);
    return useAbyss.subscribe((s) => apply(s.progress));
  }, []);

  return (
    <>
      <div
        className="grain"
        ref={grain}
        style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '160px 160px' }}
        aria-hidden
      />
      <div className="vignette" aria-hidden />
    </>
  );
}
