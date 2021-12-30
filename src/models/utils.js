import axios from 'axios';

function parseDomain(url) {
  const matcher = url.match(/^https?:\/\/([^/]*)\/?.*$/);
  if (matcher) {
    const domainWithPort = matcher[1];
    const matcher2 = domainWithPort.match(/^(.*):\d+$/);
    if (matcher2) {
      return matcher2[1];
    }
    return domainWithPort;
  }
  return undefined;
}

function parseMapName(domain) {
  if (domain.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
    return undefined;
  }
  const matcher = domain.match(/^((\w+\.?)+org|localhost)$/);
  if (matcher) {
    if (domain === 'localhost') {
      return undefined;
    }
    const sub = domain.match(/([^.]+)/g);
    // discard primary domain
    sub.pop();
    sub.pop();
    if (
      sub.length > 0 &&
      sub[0] !== 'test' &&
      sub[0] !== 'dev' &&
      sub[0] !== 'wallet' &&
      sub[0] !== 'map' &&
      sub[0] !== 'ready'
    ) {
      return sub[0];
    }
    return undefined;
  }
  throw new Error(`the domain is wrong :${domain}`);
}

/*
  to request the default API server
*/
async function requestAPI(url) {
  try {
    let urlFull = `${process.env.NEXT_PUBLIC_API_NEW}${url}`;
    urlFull = urlFull.replace(/\?/, '/query/');

    const res = await axios(urlFull);
    return res.data;
  } catch (ex) {
    throw new Error(ex.message);
  }
}

// TODO implement real code
// eslint-disable-next-line no-unused-vars
async function getContinent(lat, lon) {
  return {
    name: 'Asia',
  };
}

function formatDateString(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

export {
  parseDomain,
  parseMapName,
  requestAPI,
  getContinent,
  formatDateString,
};
