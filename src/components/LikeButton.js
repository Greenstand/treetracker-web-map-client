import { useEffect } from 'react';

function LikeButton({ url }) {
  const loadScript = () =>
    new Promise((resolve, reject) => {
      const loaded = document.getElementById('fbsdk');
      if (loaded) resolve();

      const script = document.createElement('script');
      script.id = 'fbsdk';
      script.setAttribute('crossOrigin', 'anonymous');
      script.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';
      script.setAttribute('nonce', 'B4dTchZ8');
      script.type = 'text/javascript';
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });

  useEffect(() => {
    loadScript().then(() => {
      if (typeof window.FB !== 'undefined') {
        window.FB.XFBML.parse();
      }
    });
  }, []);

  return (
    <div
      className="fb-like"
      data-href={url}
      data-width=""
      data-layout="box_count"
      data-action="like"
      data-size="small"
      data-share="false"
    />
  );
}

export default LikeButton;
