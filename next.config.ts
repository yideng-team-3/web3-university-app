import type { NextConfig } from "next";
import { resolve } from "path";


const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      resolveAlias: {
        '@components': resolve('src/components'),
        '@hooks': resolve('src/hooks'),
        '@pages': resolve('src/pages'),
        '@layouts': resolve('src/layouts'),
        '@assets': resolve('src/assets'),
        '@states': resolve('src/states'),
        '@service': resolve('src/service'),
        '@utils': resolve('src/utils'),
        '@lib': resolve('src/lib'),
        '@constants': resolve('src/constants'),
        '@connectors': resolve('src/connectors'),
        '@abis': resolve('src/abis'),
        '@types': resolve('src/types'),
        '@routes': resolve('src/routes'),
      }
    }
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config
  }
};

export default nextConfig;
