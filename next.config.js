/** @type {import('next').NextConfig} */
module.exports = {
  // reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};
