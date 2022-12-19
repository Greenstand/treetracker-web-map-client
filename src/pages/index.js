import log from 'loglevel';
import Head from 'next/head';
import Home from '../components/Home';
import StructuredData from '../components/StructuredData';

export default function Homepage({ nextExtraIsEmbed }) {
  //  test schema here: https://validator.schema.org/
  const StructuredDataExample = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'Treetracker - Home Page',
    maintainer: {
      '@type': 'Organization',
      brand: 'Greenstand',
      foundingDate: '2022-01-01',
      foundingLocation: 'Somewhere, ST',
      nonprofitStatus: 'Nonprofit501c20',
    },
  };

  log.warn(nextExtraIsEmbed);
  return (
    <>
      <StructuredData data={StructuredDataExample} />
      <Head>
        <meta
          name="description"
          content="Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters.   "
        />
        <meta
          name="keywords"
          content="trees, treetracker, greenstand, tree token, tree planting based economy, "
        />
        <meta name="author" content="metatags generator" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="3 month" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        {/* Start Facebook/OpenGraph Metadata */}
        <meta property="og:title" content="Treetracker by Greenstand" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters."
        />
        <meta property="og:url" content="https://[deployment-url].com" />
        {/* Facebook Opengraph may not be able to process .webp (???) */}
        <meta
          property="og:image"
          content="https://[deployment-url].com/public/images/bg.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Alternative image description placeholder"
        />
        <meta property="og:site_name" content="Tree Tracker" />
        {/* No need for og:locale as it defaults to en_US - unless app is undergoing i18n process */}
        {/* End Facebook/OpenGraph Metadata */}
        {/* Start Twitter Metadata */}
        <meta name="twitter:title" content="Tree Tracker" />
        <meta
          name="twitter:description"
          content="Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters."
        />
        <meta name="twitter:card" content="summary_large_card" />
        <meta name="twitter:site" content="@[treetracker-twitter-account]" />
        <meta
          name="twitter:creator"
          content="@[treetracker-dev-twitter-account]"
        />
        <meta
          name="twitter:image"
          content="https://[deployment-url].com/images/bg.webp"
        />
        <meta
          name="twitter:image:alt"
          content="Alternative image description placeholder"
        />
        {/* End Twitter Metadata */}

        <title>Treetracker by Greenstand</title>
      </Head>
      <Home />
    </>
  );
}

Homepage.isBLayout = true;
Homepage.isFloatingDisabled = true;
