'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';

interface Props {
  y: number;
  scale?: number;
  speed?: number;
  phase?: number;
  tint?: string;
}

/** 遠景をゆっくり横切る巨大生物の影。非干渉・畏怖の演出。フォグで沈む。 */
export default function GiantSilhouette({
  y,
  scale = 9,
  speed = 0.03,
  phase = 0,
  tint = '#04040a',
}: Props) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const reduced = useAbyss.getState().reducedMotion;
    const t = reduced ? phase : state.clock.elapsedTime * speed + phase;
    g.position.x = Math.sin(t) * 11;
    g.position.z = -14 + Math.cos(t) * 3;
    g.rotation.y = Math.sin(t) * 0.3;
  });

  return (
    <group ref={ref} position={[0, y, -14]} scale={scale}>
      {/* 胴 */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color={tint} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {/* 尾／触手の示唆 */}
      <mesh position={[0, -1.3, 0]} scale={[0.45, 1.5, 0.45]} raycast={() => null}>
        <sphereGeometry args={[0.6, 12, 10]} />
        <meshBasicMaterial color={tint} transparent opacity={0.42} depthWrite={false} />
      </mesh>
    </group>
  );
}
