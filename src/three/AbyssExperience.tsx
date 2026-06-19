'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { useAmbientDrone } from '@/lib/useAmbientDrone';
import ScrollTrack from '@/components/ScrollTrack';
import Intro from '@/components/Intro';
import Fieldbook from '@/components/Fieldbook';
import DepthHUD from '@/components/DepthHUD';
import GrainOverlay from '@/components/GrainOverlay';
import SoundToggle from '@/components/SoundToggle';
import CodexModal from '@/components/CodexModal';

// WebGL は SSR しない
const AbyssCanvas = dynamic(() => import('./AbyssCanvas'), { ssr: false });

/** 体験全体の統合。スクロール駆動・3D・手帳 UI を束ねる。 */
export default function AbyssExperience() {
  const reduced = useReducedMotion();
  useScrollProgress(reduced);
  useAmbientDrone();

  return (
    <>
      <div className="canvas-fixed">
        <AbyssCanvas />
      </div>

      {/* スクロール量を生む透明トラック */}
      <ScrollTrack />

      {/* 前面 UI */}
      <Intro />
      <div className="layer">
        <Fieldbook />
        <DepthHUD />
        <SoundToggle />
      </div>
      <GrainOverlay />
      <CodexModal />
    </>
  );
}
