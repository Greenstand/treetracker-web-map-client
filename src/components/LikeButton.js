import React, { useEffect } from 'react';

function LikeButton({ treeId }) {
  const loadScript = () => {
    const fbSdkIsLoaded = document.getElementById('fbsdk');

    if (!fbSdkIsLoaded) {
      const script = document.createElement('script');
      script.id = 'fbsdk';
      script.setAttribute('crossOrigin', 'anonymous');
      script.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';
      script.setAttribute('nonce', 'B4dTchZ8');
      script.type = 'text/javascript';
      document.body.append(script);
    } else {
      window.FB.XFBML.parse();
    }
  };

  useEffect(loadScript, []);

  return (
    <div
      className="fb-like"
      data-href={`https://map.treetracker.org/trees/${treeId}`}
      data-width=""
      data-layout="box_count"
      data-action="like"
      data-size="small"
      data-share="false"
    ></div>
  );
}

export default LikeButton;
