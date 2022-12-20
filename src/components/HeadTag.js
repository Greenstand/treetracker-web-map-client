/* eslint-disable react/jsx-key */
import Head from 'next/head';

export default function HeadTag({ title, openGraph, robotParameters }) {
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
    </Head>
  );
}
