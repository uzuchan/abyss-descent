'use client';

import { CATALOG } from '@/lib/catalog';
import { LAYERS, yForProgress } from '@/lib/layers';
import type { DeviceTier } from '@/lib/useDeviceTier';
import CameraRig from './CameraRig';
import FogRig from './FogRig';
import Shaft from './Shaft';
import Spores from './Spores';
import Decor from './Decor';
import Specimen from './Specimen';
import GiantSilhouette from './GiantSilhouette';

export default function Scene({ tier }: { tier: DeviceTier }) {
  // 中〜深層に巨大シルエットを配置（数はデバイスティア依存）
  const giantLayers = [2, 3, 4].slice(0, tier.giants);

  return (
    <>
      <CameraRig />
      <FogRig />
      <Shaft />
      <Spores count={tier.sporeCount} />
      <Decor count={tier.isMobile ? 14 : 36} />

      {CATALOG.map((entry) => (
        <Specimen key={entry.id} entry={entry} />
      ))}

      {giantLayers.map((li, k) => (
        <GiantSilhouette
          key={li}
          y={yForProgress((LAYERS[li].start + LAYERS[li].end) / 2)}
          scale={9}
          speed={0.025 + 0.01 * k}
          phase={k * 2.1}
        />
      ))}
    </>
  );
}
