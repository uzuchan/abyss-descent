'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAbyss } from '@/lib/store';

/** 図鑑（標本カード）。Specimen クリックで開く。Esc / 背景クリックで閉じる。 */
export default function CodexModal() {
  const entry = useAbyss((s) => s.activeEntry);
  const close = useAbyss((s) => s.close);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!entry) return;

    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    let ctx: gsap.Context | undefined;
    if (!useAbyss.getState().reducedMotion) {
      ctx = gsap.context(() => {
        gsap.fromTo('.codex', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(
          '.codex__card',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        );
      });
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      ctx?.revert();
    };
  }, [entry, close]);

  if (!entry) return null;

  return (
    <div
      className="codex"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`標本 ${entry.name}`}
    >
      <div className="codex__card" onClick={(e) => e.stopPropagation()}>
        <span className="codex__corner tl" />
        <span className="codex__corner tr" />
        <span className="codex__corner bl" />
        <span className="codex__corner br" />

        <button className="codex__close" ref={closeRef} onClick={close} aria-label="閉じる">
          ×
        </button>

        <div
          className="codex__plate"
          style={{
            background: `radial-gradient(circle at 50% 38%, ${entry.color}55, transparent 62%), linear-gradient(180deg,#0d0e15,#08080d)`,
          }}
          aria-hidden
        />

        <div className="codex__code">{entry.code}</div>
        <h2 className="codex__name">{entry.name}</h2>
        <span className="codex__class">{entry.classification}</span>
        <div className="codex__rule" />
        <p className="codex__note">{entry.note}</p>
      </div>
    </div>
  );
}
