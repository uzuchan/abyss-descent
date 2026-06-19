'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';
import { TOP_Y, BOTTOM_Y, LAYERS } from '@/lib/layers';
import { getGlowTexture } from './glowTexture';

const RADIUS = 13;
const sporeC = LAYERS.map((l) => new THREE.Color(l.spore));

/** 発光する胞子・粒子のフィールド。ゆっくり上昇し、深度で色が変わる。 */
export default function Spores({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const tex = useMemo(() => getGlowTexture(), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const top = TOP_Y + 6;
    const bottom = BOTTOM_Y - 6;
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * RADIUS;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = bottom + Math.random() * (top - bottom);
      positions[i * 3 + 2] = Math.sin(a) * r - 2;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, dt) => {
    const obj = points.current;
    if (!obj) return;
    const s = useAbyss.getState();

    // 層に応じた色付け
    const p = s.progress * (LAYERS.length - 1);
    const i = Math.min(Math.floor(p), LAYERS.length - 2);
    tmp.copy(sporeC[i]).lerp(sporeC[i + 1], p - i);
    (obj.material as THREE.PointsMaterial).color.copy(tmp);

    if (s.reducedMotion) return;

    // CPU ドリフト（上昇＋微小スウェイ）
    const attr = obj.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const top = TOP_Y + 6;
    const bottom = BOTTOM_Y - 6;
    for (let k = 0; k < count; k++) {
      let y = arr[k * 3 + 1] + speeds[k] * dt;
      if (y > top) y = bottom;
      arr[k * 3 + 1] = y;
      arr[k * 3] += Math.sin((y + k) * 0.5) * dt * 0.05;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.34}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  );
}
