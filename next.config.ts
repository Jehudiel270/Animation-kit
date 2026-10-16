import type { NextConfig } from "next";

// BUILD_TARGET=export     -> site statique dans /out (n'importe quel hébergeur)
// BUILD_TARGET=standalone -> serveur Node minimal (Docker, VPS)
const target = process.env.BUILD_TARGET;

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  output: target === "export" ? "export" : target === "standalone" ? "standalone" : undefined,
  images: { unoptimized: target === "export" },
};

export default config;
