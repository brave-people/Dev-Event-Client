const path = require('path');
const prod = process.env.NODE_ENV === 'production';

const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      mode: prod ? 'production' : 'development',
    };
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: process.env.NEXT_PUBLIC_ADMIN_DOMAIN + '/:path*',
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
