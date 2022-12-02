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
        <title>Treetracker by Greenstand</title>
      </Head>
      <Home />
    </>
  );
}

Homepage.isBLayout = true;
Homepage.isFloatingDisabled = true;
