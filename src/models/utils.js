
function parseDomain(url){
  const matcher = url.match(/^https?\:\/\/([^\/]*)\/?.*$/);
  if(matcher){
    const domainWithPort = matcher[1];
    const matcher2 = domainWithPort.match(/^(.*)\:\d+$/);
    if(matcher2){
      return matcher2[1];
    }else{
      return domainWithPort;
    }
  }else{
    return undefined;
  }
}

export {parseDomain};
