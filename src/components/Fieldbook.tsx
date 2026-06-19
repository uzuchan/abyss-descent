'use client';

import { useAbyss } from '@/lib/store';
import { LAYERS } from '@/lib/layers';

/** 手帳の枠・隅トンボ・層インデックス（現在層を強調）。 */
export default function Fieldbook() {
  const layerIndex = useAbyss((s) => s.layerIndex);

  return (
    <>
      <div className="fieldbook__frame" aria-hidden>
        <span className="fieldbook__tick tl" />
        <span className="fieldbook__tick tr" />
        <span className="fieldbook__tick bl" />
        <span className="fieldbook__tick br" />
      </div>

      <div className="fieldbook__title" aria-hidden>
        探 窟 手 帳 ／ FIELD NOTES
      </div>

      <nav className="layer-index" aria-label="深度の層">
        {LAYERS.map((l) => (
          <div
            key={l.id}
            className={`layer-index__item${l.index === layerIndex ? ' is-active' : ''}`}
          >
            <span className="layer-index__dot" />
            <span className="layer-index__num">{String(l.index).padStart(2, '0')}</span>
            <span>{l.name}</span>
          </div>
        ))}
      </nav>
    </>
  );
}
