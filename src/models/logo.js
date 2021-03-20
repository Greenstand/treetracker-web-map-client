import entity from "./entity";
import {parseDomain} from "./utils";
import {parseMapName} from "../utils";
import log from "loglevel";

export default async function(url){
  let src = require("../images/logo_floating_map.svg");
  const m = url.match(/.*wallet=(.\S+)/);
  log.log("m:", m);
  let wallet;
  if(m){
    wallet = m[1];
  }else{
    const at = url.match(/https?:\/\.*.*@(.\S+)/);
    if(at){
      wallet = at[1];
    }
  }
  if(wallet){
    const entities = await entity.getByWallet(wallet);
    if(entities && entities.length > 0 && entities[0].logo_url){
      src = entities[0].logo_url;
    }
  }
  
  //map name
  const domain = parseDomain(url);
  if(domain){
    const mapName = parseMapName(domain);
    if(mapName){
      const entities = await entity.getByMapName(mapName);
      if(entities && entities.length > 0 && entities[0].logo_url){
        src = entities[0].logo_url;
      }
    }
  }

  //map name case2
  {
    const m = url.match(/.*map_name=(.\S+)/);
    log.log("m:", m);
    let mapName;
    if(m){
      mapName = m[1];
    }
    if(mapName){
      const entities = await entity.getByMapName(mapName);
      if(entities && entities.length > 0 && entities[0].logo_url){
        src = entities[0].logo_url;
      }
    }
  }
  return src;
}

