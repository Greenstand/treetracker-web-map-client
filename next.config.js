const withImages = require('next-images');

module.exports = {
  ...withImages(),
  future: {
    webpack5: true,
  },
  env: {
    NEXT_PUBLIC_API_NEW: 'http://127.0.0.1:4010/mock',
  },
  images: {
    domains: [
      'treetracker-production-images.s3.eu-central-1.amazonaws.com',
      'treetracker-dev-images.s3.eu-central-1.amazonaws.com',
    ],
  },
};
