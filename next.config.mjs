/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three は ESM。R3F のツリーシェイクを助けるため transpile 指定。
  transpilePackages: ['three'],
  // 親ディレクトリの lockfile を誤検出しないよう、トレースのルートを固定。
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
