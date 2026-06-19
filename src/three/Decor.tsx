'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { TOP_Y, BOTTOM_Y, LAYERS } from '@/lib/layers';
import { getGlowTexture } from './glowTexture';

interface DecorItem {
  pos: [number, number, number];
  color: string;
  s: number;
}

/** 図鑑に無い装飾発光体（密度演出）。非干渉。 */
export default function Decor({ count = 36 }: { count?: number }) {
  const tex = useMemo(() => getGlowTexture(), []);
  const items = useMemo<DecorItem[]>(() => {
    const out: DecorItem[] = [];
    for (let i = 0; i < count; i++) {
      const yy = BOTTOM_Y + Math.random() * (TOP_Y - BOTTOM_Y);
      const pr = (yy - TOP_Y) / (BOTTOM_Y - TOP_Y);
      const li = Math.max(0, Math.min(LAYERS.length - 1, Math.floor(pr * LAYERS.length)));
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 7;
      out.push({
        pos: [Math.cos(a) * r, yy, Math.sin(a) * r - 2],
        color: LAYERS[li].accent,
        s: 0.4 + Math.random() * 0.8,
      });
    }
    return out;
  }, [count]);

  return (
    <group>
      {items.map((it, idx) => (
        <sprite key={idx} position={it.pos} scale={[it.s, it.s, 1]} raycast={() => null}>
          <spriteMaterial
            map={tex}
            color={it.color}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.5}
          />
        </sprite>
      ))}
    </group>
  );
}
