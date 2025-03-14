import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
