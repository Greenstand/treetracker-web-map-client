import 'leaflet/dist/leaflet.css';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import log from 'loglevel';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Map } from 'treetracker-web-map-core';
import { useMapContext } from '../mapContext';
// import { parseMapName } from '../models/utils';

// const MOBILE_WIDTH = 960;

function getParameters() {
  const parameters =
    (window.location.search &&
      window.location.search
        .slice(1)
        .split('&')
        .reduce((a, c) => {
          const [key, value] = c.split('=');
          // eslint-disable-next-line no-param-reassign
          a[key] = value;
          return a;
        }, {})) ||
    {};
  log.info('getParameters:', parameters);
  // if (!parameters.map_name) {
  //   const map_name = parseMapName(window.location.hostname);
  //   if (map_name) {
  //     log.info('Got map name from domain');
  //     parameters.map_name = map_name;
  //   }
  // }
  return parameters;
}

function MapComponent() {
  log.warn('Render ................ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  // const [tree, setTree] = React.useState(undefined);
  const mapRef = useRef(null);
  const [message, setMessage] = useState({ open: false, message: '' });
  // eslint-disable-next-line no-unused-vars
  const [timelineDate, setTimelineDate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [timelineEnabled, setTimelineEnabled] = useState(null);
  const mapContext = useMapContext();
  const router = useRouter();

  function handleMessageClose() {
    setMessage({
      open: false,
      message: '',
    });
  }

  function showMessage(messageString) {
    setMessage({
      open: true,
      message: messageString,
    });
  }

  function handleError(error) {
    showMessage(error.message);
  }

  function handleClickTree(tree) {
    log.warn('click tree:', tree);
    const path = window.location.pathname.match(
      /^\/(planters|organizations)\/\d+$/,
    );
    const isEmbed = window.location.search.match(/embed=true/);
    let prefix = '';
    if (path) {
      prefix = window.location.pathname;
    }
    const url = new URL(window.location.href);
    const { timeline } = url.searchParams;
    router.push(
      `${prefix}/trees/${tree.id}?embed=${isEmbed ? 'true' : 'false'}${
        timeline ? `&timeline=${timeline}` : ''
      }`,
    );
  }

  function injectApp() {
    log.trace('inject app');
    if (mapRef.current) {
      mapRef.current.app = {
        showPanel: () => {
          log.warn('mock show');
        },
        loaded: () => {
          log.warn('mock loaded');
        },
        loadingB: () => {
          log.warn('mock load B');
        },
        showMessage,
      };
    }
  }

  injectApp();

  // load map
  useEffect(() => {
    if (mapContext.map) return;
    log.info('load map...');
    // disable waiting for loading
    // loaded();
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUGv1-FFd7NFUS6HWNlivbKwETzuIPdKE&libraries=geometry';
    script.id = 'googleMaps';
    document.body.appendChild(script);
    const parameters = getParameters();
    const map = new Map({
      onLoad: () => {
        log.warn('mock onload');
      },
      onClickTree: handleClickTree,
      onError: handleError,
      filters: parameters,
      iconSuite: window.screen.width > 1199 ? 'ptk-b' : 'ptk-s',
      zoomControl: true,
      zoomControlPosition: 'bottomright',
    });
    map.on('moveEnd', () => {
      log.warn('update url');
      window.history.pushState(
        'treetrakcer',
        '',
        `${window.location.pathname}?bounds=${map.getCurrentBounds()}`,
      );
    });
    map.mount(mapRef.current);
    mapRef.current.map = map;
    // update context
    mapContext.setMap(map);
  }, []);

  // eslint-disable-next-line no-unused-vars
  function handleDateChange(date) {
    log.warn('date changed:', date);
    window.history.pushState('page2', '', `/?timeline=${date.join('_')}`);
    const { map } = mapRef.current;
    // refresh the url parameter
    const parameters = getParameters();
    map.setFilters({
      ...parameters,
    });
    map.rerender();
  }

  // eslint-disable-next-line no-unused-vars
  function handleDateClose() {
    setTimelineDate(undefined);
    window.history.pushState('page2', '', `/`);
    const { map } = mapRef.current;
    // refresh the url parameter
    const parameters = getParameters();
    map.setFilters({
      ...parameters,
    });
    map.rerender();
  }

  /* init timeline date */
  useEffect(() => {
    log.debug('init timeline');
    // if there are any other filter, like wallet, then close the timeline
    // or if the SubDomain is freetown.treetracker also hide timeline
    if (
      window.location.search.match(
        /(wallet=|userid=|treeid=|flavor=|token=|tree_name=|map_name=)/,
      )
      // ) ||
      // parseMapName(window.location.hostname) === 'freetown'
    ) {
      return;
    }
    const m = window.location.search.match(
      /timeline=(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})/,
    );
    if (m) {
      const date = [m[1], m[2]];
      log.warn('init date:', date);
    }
  }, []);

  return (
    <>
      <Box
        sx={{ width: '100%', height: '100%' }}
        id="map-canvas"
        ref={mapRef}
      />
      <Snackbar
        open={message.open}
        autoHideDuration={10000}
        onClose={handleMessageClose}
      >
        <Alert onClose={handleMessageClose} severity="warning">
          {message.message}
        </Alert>
      </Snackbar>
    </>
  );
}
export default MapComponent;
