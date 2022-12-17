import Head from 'next/head';

export default function HeadTag({ title, robotParameters }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      {robotParameters && <meta name="robots" content={robotParameters} />}
      <title>
        {title
          ? `${title} | Treetracker by Greenstand`
          : 'Treetracker by Greenstand'}
      </title>
    </Head>
  );
}
