import log from 'loglevel';
import Head from 'next/head';
import Home from '../components/Home';
import StructuredDataComponent from '../components/StructuredData';

export default function Homepage({ nextExtraIsEmbed }) {
  //  test schema here: https://validator.schema.org/
  const StructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Treetracker | Home Page',
      mainContentOfPage: {
        '@type': 'WebPageElement',
        cssSelector: '.tss-rksmj0-main',
        about: 'compensated reforestion',
        abstract:
          'Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters.',
        alternativeHeadline: 'Treetracker by Greenstand',
        audience: {
          '@type': 'Audience',
          name: 'Tree Growers, Eco-warriors, and anyone interested in reversing deforestation',
        },
        author: {
          '@type': 'Organization',
          areaServed: 'Global',
          legalName: 'Greenstand',
        },
        keywords:
          'trees, treetracker, greenstand, tree token, tree planting based economy',
        name: 'Treetracker',
      },
      isFamilyFriendly: 'true',
      maintainer: {
        '@type': 'Organization',
        brand: 'Greenstand',
        nonprofitStatus: 'Nonprofit501c20',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      name: 'Site Navigation',
      itemListElement: {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://beta-map.treetracker.org',
      },
    },
  ];

  log.warn(nextExtraIsEmbed);
  return (
    <>
      <StructuredDataComponent data={StructuredData} />
      <Head>
        {/* Site Verification to use google search console to preview site look as a search result  */}
        <meta
          name="google-site-verification"
          content="IT1WBlMare4PxzrCxYRt1oqH74_TDhAEUNy5XghSbGw"
        />
        <meta
          name="description"
          content="Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters.   "
        />
        <meta
          name="keywords"
          content="trees, treetracker, greenstand, tree token, tree planting based economy, "
        />
        <meta name="author" content="metatags generator" />
        <meta name="revisit-after" content="3 month" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        {/* Start Facebook/OpenGraph Metadata */}
        <meta property="og:title" content="Tree Tracker" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Treetracker is the basic mechanism to connect tree growers all over the world to an international audience. Usable by tree planting organisations as well as individual planters."
        />
        {/* Twitter will fallback to this OG property since we don't have a twiiter tag for it = ok  */}
        <meta property="og:url" content="https://beta-map.treetracker.org" />
        {/* I am using a placeholder image for now - please change when we have a branded image */}
        <meta
          property="og:image"
          content="https://media.wired.com/photos/5dc436dba14c980008129b52/191:100/w_1280,c_limit/Gear-Trees-148705250.jpg"
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@[treetracker-twitter-account]" />
        <meta
          name="twitter:creator"
          content="@[treetracker-dev-twitter-account]"
        />
        {/* I am using a placeholder image for now - please change when we have a branded image */}
        <meta
          name="twitter:image"
          content="https://media.wired.com/photos/5dc436dba14c980008129b52/191:100/w_1280,c_limit/Gear-Trees-148705250.jpg"
          // content="https://[deployment-url].com/images/bg.webp"
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
