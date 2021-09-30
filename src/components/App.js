import 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-utfgrid/L.UTFGrid.js';
import 'leaflet.gridlayer.googlemutant';

import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import expect from 'expect-runtime';
import log from 'loglevel';
import React from 'react';

import Loader from './Loader';
import LoaderB from './LoaderB';
import SidePanel from './SidePanel';
import Timeline from './Timeline';
import Map from '../models/Map';
import { parseMapName } from '../models/utils';
import { useMapContext } from '../mapContext';

const MOBILE_WIDTH = 960;

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    transform: 'scale(1.02)',
    transition: 'all 2s',
    position: 'absolute',
    width: '50%',
    height: '100%',
  },
  mapLoaded: {
    transform: 'scale(1)',
  },
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
}));

function getParameters() {
  const parameters =
    (window.location.search &&
      window.location.search
        .slice(1)
        .split('&')
        .reduce((a, c) => {
          const [key, value] = c.split('=');
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
  const classes = useStyles();
  const [sidePanelState, setSidePanelState] = React.useState('none');
  const [tree, setTree] = React.useState(undefined);
  const [hasNext, setHasNext] = React.useState(false);
  const [hasPrev, setHasPrev] = React.useState(false);
  const mapRef = React.useRef(null);
  const [isLoading, setLoading] = React.useState(true);
  const [isLoadingB, setLoadingB] = React.useState(false);
  const [message, setMessage] = React.useState({ open: false, message: '' });
  const [arrow, setArrow] = React.useState({});
  const [timelineDate, setTimelineDate] = React.useState(undefined);
  const [timelineEnabled, setTimelineEnabled] = React.useState(true);
  const mapContext = useMapContext();

  function showPanel(tree) {
    expect(tree).match({
      lat: expect.any(Number),
      lon: expect.any(Number),
    });
    log.log('show panel...');
    setSidePanelState('show');
    setTimelineEnabled(false);
    setTree(tree);
    // consider the visible of the point
    const { map } = mapRef.current;
    const leafletMap = map.getLeafletMap();
    const { x: left, y: top } = leafletMap.latLngToContainerPoint([
      tree.lat,
      tree.lon,
    ]);
    log.log('top:', top, 'left:', left);
    expect(top).number();
    expect(left).number();
    if (true) {
      log.log('the point at:', top, left);
      expect(SidePanel).property('WIDTH').number();
      const { clientWidth, clientHeight } = mapRef.current;
      expect(clientWidth).above(0);
      expect(clientHeight).above(0);
      const isOutOfViewport =
        left < 0 || top < 0 || left > clientWidth || top > clientHeight;
      const isCoveredBySidePanel =
        left > 0 && left < SidePanel.WIDTH && top > 0 && top < clientHeight;
      if (
        (isOutOfViewport || isCoveredBySidePanel) &&
        clientWidth > MOBILE_WIDTH
      ) {
        // move to right center
        const print = JSON.stringify(map);
        log.log('print:', print);
        log.log('con,sole:', map);
        const mapElement = mapRef.current;
        expect(mapElement).property('clientWidth').defined();
        const containerWidth = mapElement.clientWidth;
        const containerHeight = mapElement.clientHeight;
        expect(containerWidth).above(0);
        expect(containerHeight).above(0);
        const topCenter = containerHeight / 2;
        const leftCenter =
          (containerWidth - SidePanel.WIDTH) / 2 + SidePanel.WIDTH;
        expect(topCenter).above(0);
        expect(leftCenter).above(0);
        const x = left - leftCenter;
        const y = top - topCenter;
        log.log('pant by x,y:', x, y);
        leafletMap.panBy([x, y]);
      }
    }
    setHasNext(true);
    setHasPrev(true);
  }

  function showPanelWithoutTree() {
    log.debug('showPanelWithoutTree');
    showPanelWithoutTree(true);
  }

  function handlePrev() {
    log.debug('prev');
    const { map } = mapRef.current;
    try {
      map.goPrevPoint();
    } catch (e) {
      // failed, it's possible, when user move the map quickly, and the
      // side panel arrow button status is stale
      log.warn('go prev failed', e);
    }
  }

  function handleNext() {
    log.debug('next');
    const { map } = mapRef.current;
    expect(map).defined().property('goNextPoint').a(expect.any(Function));
    try {
      map.goNextPoint();
    } catch (e) {
      // failed, it's possible, when user move the map quickly, and the
      // side panel arrow button status is stale
      log.warn('go next failed', e);
    }
  }

  function handleSidePanelClose() {
    log.debug('handleSidePanelClose');
    setSidePanelState('none');
    setTimelineEnabled(true);
    const { map } = mapRef.current;
    map.unselectMarker();
  }

  function loaded() {
    log.warn('loaded');
    setLoading(false);
  }

  function loadingB(isLoading) {
    log.debug('loadingB');
    setLoadingB(isLoading);
  }

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

  function injectApp() {
    log.trace('inject app');
    if (mapRef.current) {
      mapRef.current.app = {
        showPanel,
        loaded,
        loadingB,
        showMessage,
        showArrow,
        hideArrow,
      };
    }
  }

  injectApp();

  // load map
  React.useEffect(() => {
    log.info('load map...');
    // disable waiting for loading
    loaded();
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUGv1-FFd7NFUS6HWNlivbKwETzuIPdKE&libraries=geometry';
    script.id = 'googleMaps';
    document.body.appendChild(script);
    const parameters = getParameters();
    const map = new Map({
      onLoad: loaded,
      onClickTree: showPanel,
      onFindNearestAt: handleFindNearestAt,
      onError: handleError,
      filters: parameters,
    });
    map.mount(mapRef.current);
    mapRef.current.map = map;
    //update context
    mapContext.setMap(map);
  }, []);

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
      <SidePanel
        tree={tree}
        state={sidePanelState}
        onClose={handleSidePanelClose}
        onShow={showPanelWithoutTree}
        onNext={handleNext}
        onPrevious={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
      <div
        onClick={(e) =>
          console.warn('click:', e, e.screenX, e.clientX, e.clientY)
        }
        className={`${classes.mapContainer} ${
          isLoading ? '' : classes.mapLoaded
        }`}
        id="map-canvas"
        ref={mapRef}
      />
      <Fade in={isLoading} timeout={{ apear: 0, exit: 1000 }}>
        <Grid container className={classes.loadingContainer}>
          <Grid item>
            <Loader />
          </Grid>
        </Grid>
      </Fade>
      {timelineEnabled && (
        <Timeline
          onDateChange={handleDateChange}
          date={timelineDate}
          onClose={handleDateClose}
        />
      )}
      <Snackbar
        open={message.open}
        autoHideDuration={10000}
        onClose={handleMessageClose}
      >
        <MuiAlert onClose={handleMessageClose} severity="warning">
          {message.message}
        </MuiAlert>
      </Snackbar>
      {arrow.direction && (
        <div
          id="arrow"
          className={`${arrow.direction || ''}`}
          style={
            sidePanelState === 'show' && arrow.direction === 'west'
              ? { left: `${SidePanel.WIDTH + 10}px` }
              : {}
          }
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
      {isLoadingB && (
        <Grid container className={classes.loadingContainerB}>
          <Grid item>
            <LoaderB />
          </Grid>
        </Grid>
      )}
    </>
  );
}
export default MapComponent;
