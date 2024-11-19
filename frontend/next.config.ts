import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        pathname: '/plus/img/logos/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },

};

export default nextConfig;
