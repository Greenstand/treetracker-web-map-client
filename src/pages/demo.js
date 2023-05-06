import React from 'react';
// import { Map } from 'treetracker-web-map-core';

const label = 'DEMO:';
function Demo() {
  const iframeRef = React.useRef();

  React.useEffect(() => {
    // jjiframeRef.current.contentWindow.alert("OK");
    setTimeout(() => {
      //      const { map } =
      //        iframeRef.current.contentDocument.querySelector('#map-canvas');
      //      console.log(label, 'map:', map);
      //      map.on('move-end', (data) => {
      //        console.log(label, 'onMoveEnd:', data);
      //      });
      //      map.on('tree-selected', (data) => {
      //        console.log(label, 'select tree:', data);
      //      });
      //      map.onClickTree((data) => {
      //        console.log(label, 'onClickTree:', data);
      //      });
      window.addEventListener(
        'message',
        (e) => console.warn(label, 'message:', e),
        false,
      );
    }, 10000);
  }, []);

  return (
    <div>
      <h1>demo</h1>
      <iframe
        id="treetracker-iframe"
        title="treetracker"
        ref={iframeRef}
        src="http://localhost:3000/"
        // src="https://map.treetracker.org/"
        width="800px"
        height="600px"
      />
    </div>
  );
}
Demo.isCLayout = true;
export default Demo;
