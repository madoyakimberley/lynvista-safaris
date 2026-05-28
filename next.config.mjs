/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "024zpj5zfr.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
