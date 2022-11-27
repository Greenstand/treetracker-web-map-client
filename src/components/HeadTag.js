import Head from 'next/head';

export default function HeadTag({ title }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <title>
        {title
          ? `${title} | Treetracker by Greenstand`
          : 'Treetracker by Greenstand'}
      </title>
    </Head>
  );
}
