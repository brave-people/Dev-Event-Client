const path = require('path');
const prod = process.env.NODE_ENV === 'production';
const name = 'Dev-Event-Client';

module.exports = {
  assetPrefix: prod ? `/${name}/` : '',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
