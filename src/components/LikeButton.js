import React, { useEffect } from 'react';

function LikeButton({ url }) {
  useEffect(() => {
    // Load the Facebook JavaScript SDK asynchronously
    window.fbAsyncInit = function() {
      FB.init({
        appId: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0'
        xfbml: true,
        version: 'v12.0'
      });
      FB.XFBML.parse(); // Render the Like button
    };

    // Insert the Facebook SDK script dynamically
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fb-like" data-href={url} data-width="" data-layout="box_count" data-action="like" data-size="small" data-share="false" />
  );
}

export default LikeButton;
