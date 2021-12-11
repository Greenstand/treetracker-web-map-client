import 'leaflet/dist/leaflet.css';

import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import expect from 'expect-runtime';
import log from 'loglevel';
import { makeStyles } from 'models/makeStyles';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { Map } from 'treetracker-web-map-core';

import { useMapContext } from '../mapContext';
import { parseMapName } from '../models/utils';

// const MOBILE_WIDTH = 960;

const useStyles = makeStyles()((theme) => ({
  mapContainer: {},
  mapLoaded: {},
  searchBox: {
    position: 'absolute',
    width: 350,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    boxSizing: 'border-box',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 22px)',
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  searchInputBox: {
    flexGrow: 1,
  },
  searchInput: {
    borderWidth: 0,
    marginLeft: 20,
    fontSize: 16,
  },
  sidePaper: {
    position: 'absolute',
    height: '100vh',
    width: 396,
    backgroundColor: 'white',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 22px)',
    },
  },
  treePicture: {
    height: 300,
  },
  avatarPaper: {
    borderRadius: '50%',
  },
  avatar: {
    height: 108,
    width: 108,
    marginTop: -77,
    border: '6px solid white',
  },
  titleBox: {
    marginBottom: 15,
  },
  nameBox: {
    marginLeft: 15,
  },
  verify: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 15,
  },
  card: {
    height: '100%',
  },
  arrowBox: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    color: 'white',
    fontSize: 36,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 34,
    margin: -23,
    width: 23,
    height: 48,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    cursor: 'pointer',
  },
  infoItem: {
    marginBottom: 10,
    '&>div': {
      marginRight: 5,
    },
  },
  loadingContainer: {
    userSelect: 'none',
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  loadingContainerB: {
    userSelect: 'none',
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapZoomContainer: {
    position: 'relative',
    zIndex: '999',
    height: '100%',
    display: 'flex',
    justifyContent: 'end',
  },
  zoomButtonContainer: {
    position: 'absolute',
    right: '0px',
    bottom: '80px',
  },
  zoomButton: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    margin: '5px 10px 5px 5px',
  },
}));

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
  if (!parameters.map_name) {
    const map_name = parseMapName(window.location.hostname);
    if (map_name) {
      log.info('Got map name from domain');
      parameters.map_name = map_name;
    }
  }
  return parameters;
}

function MapComponent() {
  log.warn('Render ................ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  const { classes } = useStyles();
  // const [tree, setTree] = React.useState(undefined);
  const mapRef = useRef(null);
  const [message, setMessage] = useState({ open: false, message: '' });
  const [arrow, setArrow] = useState({});
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

  function showArrow(direction) {
    log.debug('show arrow:', direction);
    expect(direction).oneOf(['north', 'south', 'west', 'east']);
    setArrow({
      direction,
    });
  }

  function hideArrow() {
    log.debug('hide arrow');
    // to avoid useless refresh of this component, check current arrow object
    if (arrow.direction === undefined) {
      return;
    }
    setArrow({});
  }

  function handleFindNearestAt(placement) {
    log.info('handle find nearest:', placement);
    expect(placement).oneOf(['north', 'south', 'west', 'east', 'in']);
    if (placement === 'in') {
      hideArrow();
    } else {
      showArrow(placement);
    }
  }

  async function handleArrowClick() {
    const { map } = mapRef.current;
    hideArrow();
    const nearest = await map.getNearest();
    if (nearest) {
      map.goto(nearest);
    } else {
      log.warn('can not find nearest:', nearest);
    }
  }

  function handleClickTree(tree) {
    log.warn('click tree:', tree);
    router.push(`/trees/${tree.id}`);
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
        showArrow,
        hideArrow,
      };
    }
  }

  injectApp();

  // load map
  React.useEffect(() => {
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
      onFindNearestAt: handleFindNearestAt,
      onError: handleError,
      filters: parameters,
      tileServerUrl: process.env.NEXT_PUBLIC_TILE_SERVER_URL,
      tileServerSubdomains:
        process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS.split(','),
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

  const mapZoomHandler = (type) => {
    const { map } = mapContext;

    if (type === 'in') {
      map.map.zoomIn();
    }

    if (type === 'out') {
      map.map.zoomOut();
    }
  };

  /* init timeline date */
  React.useEffect(() => {
    log.debug('init timeline');
    // if there are any other filter, like wallet, then close the timeline
    // or if the SubDomain is freetown.treetracker also hide timeline
    if (
      window.location.search.match(
        /(wallet=|userid=|treeid=|flavor=|token=|tree_name=|map_name=)/,
      ) ||
      parseMapName(window.location.hostname) === 'freetown'
    ) {
      setTimelineEnabled(false);
      return;
    }
    const m = window.location.search.match(
      /timeline=(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})/,
    );
    if (m) {
      const date = [m[1], m[2]];
      log.warn('init date:', date);
      setTimelineDate(date);
    }
  }, []);

  return (
    <>
      <Box
        onClick={(e) =>
          // leaving this lint warning as a reminder to remove this debugging feature
          console.warn('click:', e, e.screenX, e.clientX, e.clientY)
        }
        sx={{ width: '100%', height: '100%' }}
        id="map-canvas"
        ref={mapRef}
      >
        <div className={classes.mapZoomContainer}>
          <div className={classes.zoomButtonContainer}>
            <div>
              <Button
                className={classes.zoomButton}
                size="small"
                variant="outlined"
                onClick={() => mapZoomHandler('in')}
              >
                <AddIcon />
              </Button>
            </div>
            <div>
              <Button
                className={classes.zoomButton}
                size="small"
                variant="outlined"
                onClick={() => mapZoomHandler('out')}
              >
                <HorizontalRuleIcon />
              </Button>
            </div>
          </div>
        </div>
      </Box>
      <Snackbar
        open={message.open}
        autoHideDuration={10000}
        onClose={handleMessageClose}
      >
        <Alert onClose={handleMessageClose} severity="warning">
          {message.message}
        </Alert>
      </Snackbar>
      {arrow.direction && (
        <div
          id="arrow"
          className={`${arrow.direction || ''}`}
          onClick={handleArrowClick}
        >
          <div className="round">
            <div id="cta">
              <span className="arrow primera next " />
              <span className="arrow segunda next " />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default MapComponent;
