const withImages = require('next-images');

module.exports = {
  ...withImages(),
  env: {
    NEXT_PUBLIC_API_NEW: 'https://dev-k8s.treetracker.org/query',
    NEXT_PUBLIC_TILE_SERVER_URL: 'https://{s}.treetracker.org/tiles/new/',
    NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS: 'dev-k8s',
  },
  images: {
    domains: [
      'treetracker-production-images.s3.eu-central-1.amazonaws.com',
      'treetracker-dev-images.s3.eu-central-1.amazonaws.com',
      '180.earth',
      'purecatamphetamine.github.io',
    ],
    disableStaticImages: true,
  },
};
