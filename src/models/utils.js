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

    const begin = Date.now();
    const res = await axios.get(urlFull);
    const { data } = res;
    log.warn('url:', urlFull, 'took:', Date.now() - begin);
    return data;
  } catch (ex) {
    log.error('ex:', ex);
    throw ex;
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
  const thumbNailImageUrl = `${process.env.NEXT_PUBLIC_IMAGE_API}/img/${domain}/${paramUrl}/${imagePath}`;
  return thumbNailImageUrl;
};

const debounce = (func, timeout = 50) => {
  let debouncedFunc = null;

  return (...args) => {
    if (!debouncedFunc) {
      debouncedFunc = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    } else {
      clearTimeout(debouncedFunc);
      debouncedFunc = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    }
  };
};

/**
 * @param {string[]} fonts - list of google font names
 *
 * @returns {Promise} succes - true/false based if font succesfully loaded
 */
const loadFonts = (fonts) =>
  new Promise((resolve, _) => {
    try {
      // require ssr
      /* eslint-disable-next-line */
      const WebFont = require('webfontloader');
      WebFont.load({
        google: {
          families: fonts,
        },
        active: () => {
          resolve(true);
        },
        inactive: () => {
          resolve(false);
        },
      });
    } catch (err) {
      resolve(false);
    }
  });

/**
 * Optimizes fonts by only adding the fonts that are actually used in the typography
 *
 * @param {Object} theme - theme from the playground
 *
 * @returns {Object} theme - theme with optimized fonts
 */
const optimizeThemeFonts = (theme) => {
  const temp = { ...theme };
  const { typography } = theme;
  const usedFonts = {};
  // loop over all props in typography
  Object.keys(typography).forEach((key) => {
    // filter out the fontSize, htmlFontSize, etc props
    if (/font/i.test(key)) return;

    // check if font has fallbacks
    // if fallbacks -> not custom font
    const font = typography[key].fontFamily;
    if (!font || /,/.test(font)) return;

    const weight = Number(typography[key].fontWeight);

    // finally add font and corresponding weight
    if (!usedFonts[font]) {
      usedFonts[font] = new Set();
    }
    usedFonts[font].add(weight);
  });
  // convert the sets to arrays
  Object.entries(usedFonts).map(([fontName, weights]) => {
    usedFonts[fontName] = Array.from(weights).sort();
    return null;
  });
  temp.fonts = usedFonts;
  return temp;
};

function getPlanterName(firstName, lastName) {
  return `${firstName} ${(lastName && lastName.slice(0, 1)) || ''}`;
}

/**
 * @param {Object} fonts - list of google font names
 *
 * @returns {string[]} - array of fonts
 */
const convertFontObjToFontArr = (fontObj) => {
  const fontWeightNames = Object.keys(fontObj).map((key) => {
    const weightedName =
      fontObj[key].length > 0 ? `${key}:${fontObj[key].join(',')}` : key;
    return weightedName;
  });

  return fontWeightNames;
};

function nextPathBaseEncode(path, base) {
  return `${base}${path}`;
}

function nextPathBaseDecode(path, base) {
  return path.replace(base, '');
}

const wrapper = (callback) => (params) =>
  callback(params).catch((e) => {
    log.warn('error retrieving server props:', e);
    if (e.response?.status === 404) return { notFound: true };
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: Number(process.env.NEXT_CACHE_REVALIDATION_OVERRIDE) || 30,
    };
  });

const getLocationString = (country, continent) => {
  if (!country && !continent) return 'Unknown';
  if (!country) return continent;
  if (!continent) return country;
  return `${country}, ${continent}`;
};

/**
 * set mui theme prop by path
 *
 * @param {string} propPath - path to the prop
 * @param {string|number} value - new value of the prop
 * @param {Object} obj - the object to set the prop on
 *
 * @example
 * Using our playground theme
 * setPropByPath('palette.primary.main', '#FFFF33', theme)
 *
 * @returns the new theme
 */
const setPropByPath = (propPath, value, obj) => {
  if (!value || !propPath) return null;
  const temp = { ...obj };
  propPath.split('.').reduce((acc, curr, i, src) => {
    if (i === src.length - 1) {
      acc[src[src.length - 1]] = value;
      return acc[src[src.length - 1]];
    }
    return acc[curr];
  }, temp);
  return temp;
};

/**
 * get obj prop by path
 *
 * @param {string} propPath - path to the prop
 * @param {Object} obj - the object to get the prop from
 *
 * @example
 * Using our playground theme
 * // returns #FFFF33
 * getPropByPath('palette.primary.main', theme)
 *
 * @example
 * Using our playground theme
 * // returns { main: xxx, light: xxx, dark: xxx }
 * getPropByPath('palette.primary', theme)
 *
 * @returns the prop value
 */
const getPropByPath = (propPath, obj) => {
  if (!propPath) return null;
  return propPath.split('.').reduce((acc, curr) => acc[curr], obj);
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
  loadFonts,
  optimizeThemeFonts,
  getPlanterName,
  convertFontObjToFontArr,
  nextPathBaseDecode,
  nextPathBaseEncode,
  wrapper,
  getLocationString,
  setPropByPath,
  getPropByPath,
};
