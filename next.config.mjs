/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.ls2helmets.com',
      },
      {
        protocol: 'https',
        hostname: 'static.ls2helmets.com',
      },
      {
        protocol: 'https',
        hostname: '**.motulindia.com',
      },
      {
        protocol: 'https',
        hostname: 'motulindia.com',
      },
      {
        protocol: 'https',
        hostname: '**.tradeinn.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tradeinn.com',
      },
      {
        protocol: 'https',
        hostname: '**.alpinestars.com',
      },
      {
        protocol: 'https',
        hostname: 'www.alpinestars.com',
      },
    ],
  },
};

export default nextConfig;
