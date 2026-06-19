'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useAbyss } from '@/lib/store';
import { yForProgress } from '@/lib/layers';
import { damp } from '@/lib/math';
import { getGlowTexture } from './glowTexture';
import type { CatalogEntry, SpecimenKind } from '@/lib/catalog';

function Geometry({ kind }: { kind: SpecimenKind }) {
  switch (kind) {
    case 'plant':
      return <icosahedronGeometry args={[0.5, 1]} />;
    case 'creature':
      return <capsuleGeometry args={[0.3, 0.8, 6, 12]} />;
    case 'relic':
      return <octahedronGeometry args={[0.55, 0]} />;
    default:
      return <torusKnotGeometry args={[0.32, 0.12, 80, 10]} />;
  }
}

/** 図鑑に対応するクリック可能な発光体。hover で発光・拡大、click で標本カードを開く。 */
export default function Specimen({ entry }: { entry: CatalogEntry }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => getGlowTexture(), []);
  const color = useMemo(() => new THREE.Color(entry.color), [entry.color]);
  const open = useAbyss((s) => s.open);
  const y = yForProgress(entry.p);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const reduced = useAbyss.getState().reducedMotion;
    const targetScale = (hovered ? 1.25 : 1) * entry.size;
    const sc = damp(g.scale.x, targetScale, 6, dt);
    g.scale.setScalar(sc);

    if (reduced) {
      g.position.y = y;
    } else {
      const t = state.clock.elapsedTime;
      g.position.y = y + Math.sin(t * 0.6 + entry.p * 40) * 0.2; // ふわりと上下
      if (core.current) core.current.rotation.y = t * 0.3;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    open(entry);
  };

  return (
    <group
      ref={group}
      position={[entry.x, y, entry.z]}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {/* 本体 */}
      <mesh ref={core}>
        <Geometry kind={entry.kind} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.4 : 1.3}
          roughness={0.4}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* グロー */}
      <sprite scale={[2.6, 2.6, 1]} raycast={() => null}>
        <spriteMaterial
          map={tex}
          color={color}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={hovered ? 0.95 : 0.55}
        />
      </sprite>

      {/* クリック判定（透明・大きめ） */}
      <mesh>
        <sphereGeometry args={[1.05, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
