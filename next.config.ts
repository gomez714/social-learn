import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
    }
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh`,
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source:'/hashtag/:tag',
        destination: '/search?q=%23:tag'
      }
    ]
  }
};

export default nextConfig;
