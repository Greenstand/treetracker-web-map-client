import React from "react";
import { useRouter } from 'next/router'
import log from "loglevel";
import {useMapContext} from "../../mapContext";

const Tree = ({tree}) => {
  const router = useRouter()
  const { treeid } = router.query

  const mapContext = useMapContext();

  log.warn("map:", mapContext);

  React.useEffect(() => {
    //manipulate the map
    mapContext.map.flyTo(tree.lat, tree.lon, 16);
  }, [] );

  return (
    <div style={{color:"white"}}>
      <h1>Tree:#{tree.id}</h1>
      <img src={tree.photo_url}/>
    </div>
  );
}


export async function getServerSideProps({params}) {
  log.warn("params:", params);
  log.warn("host:", process.env.NEXT_PUBLIC_API_NEW);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_NEW}/trees/${params.treeid}`);
  const tree = await res.json();

  return {
    props: {
      tree,
    },
  }
}

export default Tree
