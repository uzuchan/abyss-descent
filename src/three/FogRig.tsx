'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';
import { LAYERS } from '@/lib/layers';
import { lerp } from '@/lib/math';

// 層ごとの色を事前生成
const bgC = LAYERS.map((l) => new THREE.Color(l.background));
const fogC = LAYERS.map((l) => new THREE.Color(l.fog));
const ambC = LAYERS.map((l) => new THREE.Color(l.ambient));
const accC = LAYERS.map((l) => new THREE.Color(l.accent));

/**
 * 深度に応じて背景・フォグ・ライトを連続補間する環境リグ。
 * アクセント点光源はカメラに追従し、近傍をほのかに照らす。
 */
export default function FogRig() {
  const { scene, camera } = useThree();
  const ambient = useRef<THREE.AmbientLight>(null!);
  const accent = useRef<THREE.PointLight>(null!);

  const bg = useMemo(() => new THREE.Color(LAYERS[0].background), []);
  const tmpAcc = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    scene.background = bg;
    scene.fog = new THREE.FogExp2(LAYERS[0].fog, LAYERS[0].fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene, bg]);

  useFrame(() => {
    const p = useAbyss.getState().progress * (LAYERS.length - 1);
    const i = Math.min(Math.floor(p), LAYERS.length - 2);
    const t = p - i;

    // 背景
    bg.copy(bgC[i]).lerp(bgC[i + 1], t);

    // フォグ
    const fog = scene.fog as THREE.FogExp2 | null;
    if (fog) {
      fog.color.copy(fogC[i]).lerp(fogC[i + 1], t);
      fog.density = lerp(LAYERS[i].fogDensity, LAYERS[i + 1].fogDensity, t);
    }

    // 環境光
    if (ambient.current) {
      ambient.current.color.copy(ambC[i]).lerp(ambC[i + 1], t);
      ambient.current.intensity = lerp(
        LAYERS[i].ambientIntensity,
        LAYERS[i + 1].ambientIntensity,
        t,
      );
    }

    // アクセント光（カメラ追従）
    if (accent.current) {
      tmpAcc.copy(accC[i]).lerp(accC[i + 1], t);
      accent.current.color.copy(tmpAcc);
      accent.current.position.set(
        camera.position.x,
        camera.position.y - 1.5,
        camera.position.z - 2.5,
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.7} />
      <pointLight ref={accent} intensity={34} distance={34} decay={2} />
    </>
  );
}
