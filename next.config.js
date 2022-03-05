const path = require('path');
const prod = process.env.NODE_ENV === 'production';
const name = 'Dev-Event-Client';

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
  assetPrefix: prod ? `/${name}/` : '',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
