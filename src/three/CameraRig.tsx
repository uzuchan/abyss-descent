'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';
import { yForProgress } from '@/lib/layers';
import { damp } from '@/lib/math';

const target = new THREE.Vector3();

/** スクロール進捗に同期してカメラを降下させる。低モーション時は揺れを止める。 */
export default function CameraRig() {
  const { camera } = useThree();

  useFrame((state, dt) => {
    const s = useAbyss.getState();
    const targetY = yForProgress(s.progress);

    // フレームレート非依存の降下
    camera.position.y = damp(camera.position.y, targetY, 3.5, dt);

    // 微小な揺れ（不穏さ）。reduced motion で停止
    const sway = s.reducedMotion ? 0 : 1;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.15) * 0.5 * sway;
    camera.position.z = 7 + Math.sin(t * 0.1) * 0.3 * sway;

    // 視線は少し下方・前方（降下感）
    target.set(0, camera.position.y - 4, -2);
    camera.lookAt(target);
  });

  return null;
}
