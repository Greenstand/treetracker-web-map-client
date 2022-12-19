import log from 'loglevel';
import Head from 'next/head';
import Home from '../components/Home';

export default function Homepage({ nextExtraIsEmbed }) {
  log.warn(nextExtraIsEmbed);
  return (
    <>
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
        {/* The tag below is the canonical URL aka the URL that 
        will hold data about likes and shares for the entire app */}
        <meta property="og:url" content="https://[deployment-url].com" />
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
        {/* End Facebook/OpenGraph Metadata */}

        <title>Treetracker by Greenstand</title>
      </Head>
      <Home />
    </>
  );
}

Homepage.isBLayout = true;
Homepage.isFloatingDisabled = true;
