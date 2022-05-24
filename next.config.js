/* eslint-disable require-await */
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
  async redirects() {
    return [
      {
        source: '/_next/static/images/:image*',
        destination: `${process.env.NEXT_PUBLIC_BASE}/_next/static/images/:image*`,
        permanent: true,
        basePath: false,
      },
    ];
  },
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
    ];
  },
  basePath: process.env.NEXT_PUBLIC_BASE,
};
