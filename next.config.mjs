/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      ...(supabaseUrl
        ? [{
            protocol: supabaseUrl.protocol.replace(':', ''),
            hostname: supabaseUrl.hostname,
            port: '',
            pathname: '/storage/v1/object/public/**',
          }]
        : []),
    ],
  },
};

export default nextConfig;
