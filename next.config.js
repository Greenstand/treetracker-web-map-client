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
  async rewrites() {
    return [
      {
        source: '/planters/:planterId(\\d{1,})/trees/:treeId(\\d{1,})',
        destination: '/trees/:treeId(\\d{1,})',
      },
      {
        source:
          '/organizations/:organizationId([0-9a-zA-Z-]{1,})/trees/:treeId(\\d{1,})',
        destination: '/trees/:treeId(\\d{1,})',
      },
      {
        source: '/wallets/:walletId([0-9a-zA-Z-]{1,})/tokens/:tokenId(.{36})',
        destination: '/tokens/:tokenId([a-z0-9-]{36})',
      },
      {
        source: '/map/:map_name(\\d{1,})',
        destination: '/?map=:map_name',
      },
      {
        source: '/wallets/:walletId([0-9a-zA-Z-]{1,})/tokens',
        destination: '/tokens/idfromquery',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path((?!trees).*)',
        has: [
          {
            type: 'query',
            key: 'treeid',
            value: '(?<treeId>(\\d{1,}))',
          },
        ],
        destination: '/trees/:treeId(\\d{1,})',
        permanent: true,
      },
      {
        source: '/:path((?!planters).*)',
        has: [
          {
            type: 'query',
            key: 'userid',
            value: '(?<planterId>(\\d{1,}))',
          },
        ],
        destination: '/planters/:planterId(\\d{1,})',
        permanent: true,
      },
      {
        source: '/:path((?!wallets).*)',
        has: [
          {
            type: 'query',
            key: 'wallet',
            value: '(?<walletId>(\\w{1,}))',
          },
        ],
        destination: '/wallets/:walletId(\\d{1,})',
        permanent: true,
      },
    ];
  },
  basePath: process.env.NEXT_PUBLIC_BASE,
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {},
          },
        ],
      },
    );
    return config;
  },
};
