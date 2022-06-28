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
      return { ...country, name: 'United Republic of Tanzania' };
    }
    if (country.name === 'Democratic Republic of the Congo') {
      return { ...country, name: 'Democratic Republic of the Congo' };
    }
    return country;
  });

// For places that display a small size of pictures, we should use our image API to load it.
// https://dev-k8s.treetracker.org/images/img/:domain/:params/:image
// E.g.,
// https://dev-k8s.treetracker.org/images/img/treetracker-dev-images.s3.eu-central-1.amazonaws.com/w=300,h=400,r=90/2020.05.19.15.41.53_37.421998333333335_-122.08400000000002_c36747a4-101f-43ff-9a91-45b3cb9bfd01_IMG_20200515_141055_7587706704717292658.jpg
// Params are width (pixels), height (pixels) and rotation (degrees).
const getThumbnailImageUrls = (imageUrl, width = 400, height = 400) => {
  if (!imageUrl) return '';
  const imageUrlArr = imageUrl.split('/');
  const domain = imageUrlArr[imageUrlArr.length - 2];
  const imagePath = imageUrlArr[imageUrlArr.length - 1];
  const paramUrl = `w=${width},h=${height}`;
  const thumbNailImageUrl = `https://dev-k8s.treetracker.org/images/img/${domain}/${paramUrl}/${imagePath}`;
  return thumbNailImageUrl;
};

const debounce = (func, timeout = 50) => {
  let debouncedFunc = null;

  return () => {
    if (!debouncedFunc) {
      debouncedFunc = setTimeout(func, timeout);
    } else {
      clearTimeout(debouncedFunc);
      debouncedFunc = setTimeout(func, timeout);
    }
  };
};

export {
  hideLastName,
  parseDomain,
  parseMapName,
  requestAPI,
  getContinent,
  formatDateString,
  formatDates,
  fixCountryNames,
  getThumbnailImageUrls,
  debounce,
};
