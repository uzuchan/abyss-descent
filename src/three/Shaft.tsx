'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';
import { TOP_Y, BOTTOM_Y, LAYERS, yForProgress, layerBlend } from '@/lib/layers';

const RADIUS = 16;
const wallC = LAYERS.map((l) => new THREE.Color(l.wall));

/** 縦穴の壁（内向きシリンダ）と、層境界を示す深度リング。壁色は深度で明→暗に変化。 */
export default function Shaft() {
  const height = TOP_Y - BOTTOM_Y + 80;
  const centerY = (TOP_Y + BOTTOM_Y) / 2;
  const wallMat = useRef<THREE.MeshStandardMaterial>(null);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!wallMat.current) return;
    const { i, t } = layerBlend(useAbyss.getState().progress);
    tmp.copy(wallC[i]).lerp(wallC[i + 1], t);
    wallMat.current.color.copy(tmp);
  });

  return (
    <group>
      {/* 壁 */}
      <mesh position={[0, centerY, 0]} raycast={() => null}>
        <cylinderGeometry args={[RADIUS, RADIUS, height, 48, 1, true]} />
        <meshStandardMaterial ref={wallMat} color="#aebcc4" roughness={1} metalness={0} side={THREE.BackSide} />
      </mesh>

      {/* 層境界リング（深度の刻み） */}
      {LAYERS.map((l) => (
        <mesh
          key={l.id}
          position={[0, yForProgress(l.start), 0]}
          rotation={[Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <torusGeometry args={[RADIUS - 0.4, 0.05, 6, 64]} />
          <meshBasicMaterial color={l.accent} transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}
