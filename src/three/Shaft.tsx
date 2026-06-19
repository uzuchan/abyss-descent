'use client';

import * as THREE from 'three';
import { TOP_Y, BOTTOM_Y, LAYERS, yForProgress } from '@/lib/layers';

const RADIUS = 16;

/** 縦穴の壁（内向きシリンダ）と、層境界を示す深度リング。 */
export default function Shaft() {
  const height = TOP_Y - BOTTOM_Y + 80;
  const centerY = (TOP_Y + BOTTOM_Y) / 2;

  return (
    <group>
      {/* 壁 */}
      <mesh position={[0, centerY, 0]} raycast={() => null}>
        <cylinderGeometry args={[RADIUS, RADIUS, height, 48, 1, true]} />
        <meshStandardMaterial color="#0b0b12" roughness={1} metalness={0} side={THREE.BackSide} />
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
