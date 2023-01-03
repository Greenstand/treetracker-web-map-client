/* eslint-disable react/jsx-key */
import Head from 'next/head';

export default function HeadTag({
  title,
  openGraph,
  robotParameters,
  twitter,
}) {
  const openGraphTags = (
    <>
      {openGraph?.title && (
        <meta property="og:title" content={openGraph.title} />
      )}
      {openGraph?.description && (
        <meta property="og:description" content={openGraph.description} />
      )}
      {openGraph?.images &&
        openGraph.images.map((image) => (
          <meta property="og:image" content={image} />
        ))}
      {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
      {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
      {openGraph?.locale && (
        <meta property="og:locale" content={openGraph.locale} />
      )}
    </>
  );

  return (
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      {robotParameters && <meta name="robots" content={robotParameters} />}
      <title>
        {title
          ? `${title} | Treetracker by Greenstand`
          : 'Treetracker by Greenstand'}
      </title>
      {openGraphTags}
      {twitter?.title && <meta name="twitter:title" content={twitter.title} />}
      {twitter?.description && (
        <meta name="twitter:description" content={twitter.description} />
      )}
      {twitter?.cardType && (
        <meta name="twitter:card" content={twitter.cardType} />
      )}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && (
        <meta name="twitter:creator" content={twitter.creator} />
      )}
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter?.alt && <meta name="twitter:image:alt" content={twitter.alt} />}
    </Head>
  );
}
