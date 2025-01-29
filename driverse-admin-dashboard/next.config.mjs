/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://drivers-server-7i39.onrender.com/api/:path*'
      }
    ];
  }
};

export default nextConfig;