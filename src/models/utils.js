import axios from 'axios';
import log from 'loglevel';
import moment from 'moment';

function hideLastName(name) {
  const fullNameArray = name.split(' ');
  const hiddenFullName = `${fullNameArray[0]} ${fullNameArray[1][0]}`;
  return hiddenFullName;
}

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
  if (!url) {
    throw new Error('url is not defined');
  }
  try {
    const urlFull = `${process.env.NEXT_PUBLIC_API}${url}`;
    log.warn('requestAPI:', urlFull);
    // urlFull = urlFull.replace(/\?/, '/query/');

    const res = await axios.get(urlFull);
    const { data } = res;
    return data;
  } catch (ex) {
    log.error('ex:', ex);
    throw new Error(ex.message);
  }
}

// TODO implement real code
// eslint-disable-next-line no-unused-vars
function getContinent(lat, lon) {
  return {
    name: 'Asia',
  };
}

function formatDateString(date) {
  return new Date(date).toLocaleDateString('en-GB');
}

//
const formatDates = (date, format) =>
  moment(date, 'ddd MMM DD YYYY HH:mm:ss').format(format);

// Fix country names so it get return the correct alpha2 code for the flags
// todo other faulty country names should be added later
const fixCountryNames = (countries) =>
  countries.map((country) => {
    if (country.name === 'Tanzania') {
      return { ...country, name: 'Tanzania, United Republic of' };
    }
    if (country.name === 'Democratic Republic of the Congo') {
      return { ...country, name: 'Congo, the Democratic Republic of the' };
    }
    return country;
  });

export {
  hideLastName,
  parseDomain,
  parseMapName,
  requestAPI,
  getContinent,
  formatDateString,
  formatDates,
  fixCountryNames,
};
