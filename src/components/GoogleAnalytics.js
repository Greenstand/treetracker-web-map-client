import Script from 'next/script';
import React from 'react';
import { getEnv } from 'models/runtimeEnv';

/*
  The id comes from the runtime env (window.__RUNTIME_ENV__), so one image
  works for each deploy. Static pages are rendered at build time without it,
  so read it after mount. No id means no Google Analytics.
*/
function GoogleAnalytics() {
  const [gaId, setGaId] = React.useState(null);

  React.useEffect(() => {
    setGaId(getEnv('NEXT_PUBLIC_GA_ID') || null);
  }, []);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          gaId,
        )}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', ${JSON.stringify(gaId)});
    `}
      </Script>
    </>
  );
}

export default GoogleAnalytics;
