import React from 'react';
import log from 'loglevel';
import { useMapContext } from '../../mapContext';

const Tree = ({ tree }) => {
  const mapContext = useMapContext();

  log.warn('map:', mapContext);

  React.useEffect(() => {
    //manipulate the map
    if (mapContext.map) {
      mapContext.map.flyTo(tree.lat, tree.lon, 16);
    }
  }, [mapContext.map]);

  return (
    <div style={{ color: 'white' }}>
      <h1>Tree:#{tree.id}</h1>
      <img src={tree.photo_url} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  log.warn('params:', params);
  log.warn('host:', process.env.NEXT_PUBLIC_API_NEW);

  const url = `${process.env.NEXT_PUBLIC_API_NEW}/trees/${params.treeid}`;
  log.warn('url:', url);

  const res = await fetch(url);
  const tree = await res.json();
  log.warn('response:', tree);

  return {
    props: {
      tree,
    },
  };
}

export default Tree;
