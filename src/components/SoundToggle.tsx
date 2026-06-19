'use client';

import { useAbyss } from '@/lib/store';

/** 環境音（合成ドローン）の ON/OFF。既定 OFF（ユーザー操作で開始）。 */
export default function SoundToggle() {
  const soundOn = useAbyss((s) => s.soundOn);
  const toggle = useAbyss((s) => s.toggleSound);

  return (
    <button
      className={`sound${soundOn ? ' is-on' : ''}`}
      onClick={toggle}
      aria-pressed={soundOn}
      aria-label="環境音の切り替え"
    >
      <span className="sound__bars" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span>{soundOn ? '環境音 ON' : '環境音 OFF'}</span>
    </button>
  );
}
