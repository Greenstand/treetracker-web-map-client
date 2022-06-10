const withImages = require('next-images');

module.exports = {
  ...withImages(),
  images: {
    domains: [
      'treetracker-production-images.s3.eu-central-1.amazonaws.com',
      'treetracker-dev-images.s3.eu-central-1.amazonaws.com',
      '180.earth',
      'purecatamphetamine.github.io',
      'treetracker-production.nyc3.digitaloceanspaces.com',
    ],
    disableStaticImages: true,
  },
  // eslint-disable-next-line require-await
  async rewrites() {
    return [
      {
        source: '/planters/:planter_id(\\d{1,})/trees/:tree_id(\\d{1,})',
        destination: '/trees/:tree_id(\\d{1,})',
      },
      {
        source:
          '/organizations/:organization_id(\\d{1,})/trees/:tree_id(\\d{1,})',
        destination: '/trees/:tree_id(\\d{1,})',
      },
      {
        source: '/map/:map_name(\\d{1,})',
        destination: '/?map=:map_name',
      },
    ];
  },
  basePath: process.env.NEXT_PUBLIC_BASE,
};
