'use client';

import { useEffect, useRef } from 'react';
import { useAbyss } from '@/lib/store';
import { smoothstep } from '@/lib/math';

/** 地上のタイトル。降下（progress 上昇）でフェード退場する。 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (progress: number) => {
      const el = ref.current;
      if (!el) return;
      const o = 1 - smoothstep(0.0, 0.06, progress);
      el.style.opacity = String(o);
      el.style.transform = `translateY(${-progress * 60}px)`;
      el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
    };
    apply(useAbyss.getState().progress);
    return useAbyss.subscribe((s) => apply(s.progress));
  }, []);

  return (
    <div className="intro" ref={ref} aria-hidden>
      <div className="intro__kicker">DESCENT INTO THE ABYSS</div>
      <h1 className="intro__title">深淵探窟</h1>
      <p className="intro__sub">
        可憐さと異質さが共存する、童話的で不穏な深淵へ。
        <br />
        地上から、名もなき深部まで。
      </p>
      <div className="intro__hint">
        <span>SCROLL ↓</span>
      </div>
    </div>
  );
}
