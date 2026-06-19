'use client';

import { useEffect, useRef } from 'react';
import { useAbyss } from '@/lib/store';
import { LAYERS } from '@/lib/layers';

/** 現在深度（大字）・層名・降下ゲージ。 */
export default function DepthHUD() {
  const depth = useAbyss((s) => s.depth);
  const layerIndex = useAbyss((s) => s.layerIndex);
  const fill = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  // ゲージは連続値なので、再描画を起こさず imperative に反映
  useEffect(() => {
    const apply = (p: number) => {
      if (fill.current) fill.current.style.height = `${p * 100}%`;
      if (cursor.current) cursor.current.style.top = `${p * 100}%`;
    };
    apply(useAbyss.getState().progress);
    return useAbyss.subscribe((s) => apply(s.progress));
  }, []);

  const layer = LAYERS[layerIndex];

  return (
    <>
      <div className="depth__gauge" aria-hidden>
        <div className="depth__gauge-fill" ref={fill} />
        <div className="depth__gauge-cursor" ref={cursor} />
      </div>

      <div className="depth" role="status" aria-live="polite">
        <div className="depth__layer">{layer.name}</div>
        <div>
          <span className="depth__value">{depth.toLocaleString('en-US')}</span>
          <span className="depth__unit">m</span>
        </div>
      </div>
    </>
  );
}
