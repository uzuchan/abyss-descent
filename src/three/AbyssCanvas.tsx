'use client';

import { Canvas } from '@react-three/fiber';
import { useDeviceTier } from '@/lib/useDeviceTier';
import { TOP_Y } from '@/lib/layers';
import Scene from './Scene';

/** R3F Canvas。next/dynamic({ ssr:false }) で読み込まれる（WebGL はクライアント専用）。 */
export default function AbyssCanvas() {
  const tier = useDeviceTier();
  return (
    <Canvas
      dpr={tier.dpr}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 62, near: 0.1, far: 240, position: [0, TOP_Y, 7] }}
      // 縦スクロールをキャンバス上でも通すため touch-action を上書き（既定の none を解除）
      style={{ touchAction: 'pan-y' }}
    >
      <Scene tier={tier} />
    </Canvas>
  );
}
