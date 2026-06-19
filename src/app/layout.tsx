import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '深淵探窟 — Abyss',
  description:
    '可憐さと異質さが共存する、童話的で不穏な深淵世界。縦スクロールで未知の縦穴を降下する没入型体験。',
};

export const viewport: Viewport = {
  themeColor: '#08080c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
