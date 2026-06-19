'use client';

import { SCROLL_VH } from '@/lib/layers';

/** スクロール量を生む透明な縦長トラック。深さ = スクロール長。 */
export default function ScrollTrack() {
  return <div className="scroll-track" style={{ height: `${SCROLL_VH}vh` }} aria-hidden />;
}
