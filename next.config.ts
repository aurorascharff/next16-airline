import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Lets `@next/playwright`'s `instant()` run against `next start` when set (never in real deploys).
    exposeTestingApiInProductionBuild: process.env.NEXT_TESTING_API === '1',
    inlineCss: true,
    useOffline: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
