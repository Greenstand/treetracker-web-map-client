function parseMapName(domain){
  if(domain.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)){
    return undefined;
  }
  const matcher = domain.match(/^((\w+\.?)+org|localhost)$/);
  if(matcher){
    if(domain === "localhost"){
      return undefined;
    }
    const sub = domain.match(/([^.]+)/g);
    // discard primary domain
    sub.pop();
    sub.pop();
    if(
      sub.length > 0 &&
      sub[0] !== "test" &&
      sub[0] !== "dev" &&
      sub[0] !== "wallet" &&
      sub[0] !== "map" &&
      sub[0] !== "ready"
    ){
      return sub[0];
    }else{
      return undefined;
    }
  }else{
    throw new Error(`the domain is wrong :${domain}`);
  }
}

const roundNumber = function (number, places) {
  return Number(`${Math.round(+(number + "e+" + places))}e-${places}`);
}

const boundsToString = function (bounds) {
  return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].map(bound => {
    return roundNumber(bound, 6);
  }).join(",");
}

export {parseMapName, roundNumber, boundsToString}
