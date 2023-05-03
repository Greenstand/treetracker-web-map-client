import React from 'react';

function Demo() {
  const iframeRef = React.useRef();

  React.useEffect(() => {
    // jjiframeRef.current.contentWindow.alert("OK");
    setTimeout(() => {
      const {map} = iframeRef.current.contentDocument.querySelector('#map-canvas');
      console.log('map:', map);
      map.onClickTree((data) => {
        console.log('onClickTree:', data);
      });
    }, 5000);
  }, []);

  return (
    <div>
      <h1>demo</h1>
      <iframe
        id="treetracker-iframe"
        title="treetracker"
        ref={iframeRef}
        src="http://localhost:3000/"
        width="800px"
        height="600px"
       />
    </div>
  );
}
Demo.isCLayout = true;
export default Demo;
