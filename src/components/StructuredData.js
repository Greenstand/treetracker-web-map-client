import DOMPurify from 'isomorphic-dompurify';
import Head from 'next/head';

export default function StructuredData({ data }) {
  const sanitizer = DOMPurify.sanitize;
  return (
    <Head>
      <script
        key="structured-data"
        type="application/ld+json"
        //  Source(s): Easy way to implement structured data for entire app - https://www.codeconcisely.com/posts/nextjs-structured-data/,
        //  Safely sanitize incoming data/information - https://newbedev.com/safe-alternative-to-dangerouslysetinnerhtml#:~:text=Safe%20alternative%20to%20dangerouslySetInnerHTML%20If%20XSS%20is%20your,10K%20minified.%20And%20it%20works%20in%20Node%20too.

        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sanitizer(JSON.stringify(data)) }}
      />
    </Head>
  );
}
