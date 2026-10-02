import Document, { Head, Html, Main, NextScript } from 'next/document';
import { withEmotionCache } from 'tss-react/nextJs';
import { createMuiCache } from './_app';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Blocking on purpose: must set __RUNTIME_ENV__ before app code. */}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
            src={`${process.env.NEXT_PUBLIC_BASE || ''}/api/runtime-env`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default withEmotionCache({
  Document: MyDocument,
  /**
   * Every emotion cache used in the app should be provided.
   * Caches for MUI should use "prepend": true.
   * */
  getCaches: () => [createMuiCache()],
});
