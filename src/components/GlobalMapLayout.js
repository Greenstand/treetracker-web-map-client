import { TextField, Button } from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Map } from 'treetracker-web-map-core';
import { useDashboardContext } from 'context/dashboardContext';
import { updateMapLocation } from 'models/config.reducer';
import { makeStyles } from 'models/makeStyles';
import { useMapContext } from '../mapContext';

const App = dynamic(() => import('./App'), { ssr: false });

const useStyles = makeStyles()(() => ({
  root: {
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function isNumberUnderLimits(number, limits) {
  const [min, max] = limits;
  return number >= min && number <= max;
}

function isNumber(val) {
  return !Object.is(val, NaN) && typeof val === 'number';
}

export default function MapLayout() {
  const mapContext = useMapContext();
  const { state: config, dispatch } = useDashboardContext();
  const { initialLocation } = config.map;
  const { classes } = useStyles();
  const [lat, setLat] = useState(initialLocation.lat);
  const [latError, setLatError] = useState('');
  const [lon, setLon] = useState(initialLocation.lon);
  const [lonError, setLonError] = useState('');
  const [zoom, setZoom] = useState(initialLocation.zoom);
  const [zoomError, setZoomError] = useState('');
  const [mapDetails, setMapDetails] = useState(null);

  useEffect(() => {
    const { map } = mapContext;
    if (!map) return;
    setMapDetails(map.getCurrentView());
    map.on(Map.REGISTERED_EVENTS.MOVE_END, () => {
      setMapDetails(map.getCurrentView());
    });
  }, [mapContext]);

  function disableSubmitButton() {
    return !latError && !lonError && !zoomError && lat && lon && zoom;
  }

  function handleLatError(latd) {
    if (!isNumber(latd)) {
      setLatError(`lat must be of type number`);
      return true;
    }

    if (!isNumberUnderLimits(latd, [-90, 90])) {
      setLatError(`lat must be between -90 and  90`);
      return true;
    }

    return false;
  }

  function handleLonError(long) {
    if (!isNumber(long)) {
      setLonError(`lon must be of type number`);
      return true;
    }

    if (!isNumberUnderLimits(long, [-180, 180])) {
      setLonError(`lon must be between -180 and  180`);
      return true;
    }

    return false;
  }

  function handleZoomError(zoomLevel) {
    if (!isNumber(zoomLevel)) {
      setZoomError(`zoomLevel must be of type number`);
      return true;
    }

    if (!isNumberUnderLimits(zoomLevel, [2, 20])) {
      setZoomError(`zoomLevel must be between 2  and  20`);
      return true;
    }

    return false;
  }

  function handleChange(e, type) {
    const value = e.target.value.trim();
    if (type === 'lat') {
      if (!handleLatError(+value)) {
        setLat(value);
        setLatError('');
        return;
      }
      setLat(value.trim());
    }

    if (type === 'lon') {
      if (!handleLonError(+value)) {
        setLon(value);
        setLonError('');
        return;
      }
      setLon(value.trim());
    }

    if (type === 'zoom') {
      if (!handleZoomError(+value)) {
        setZoom(+value);
        setZoomError('');
        return;
      }
      setZoom(value.trim());
    }
  }

  function handleSubmit() {
    if (!mapContext.map) return;
    dispatch(
      updateMapLocation({
        lat,
        lon,
        zoom,
      }),
    );
  }

  return (
    <Box>
      <Box className={classes.root}>
        <App />
      </Box>
      <Box>
        <Box
          sx={{
            margin: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <TextField
            variant="standard"
            label="Current Latitude of Map"
            // bcz sometimes 0 can get coerced to falsy
            // that's why i used toString at the end
            value={`${mapDetails?.center.lat.toString() || ''}`}
          />
          <TextField
            variant="standard"
            label="Current Longitude of Map"
            // bcz sometimes 0 can get coerced to falsy
            // that's why i used toString at the end
            value={`${mapDetails?.center.lng.toString() || ''}`}
          />
          <TextField
            variant="standard"
            label="Current Zoom level of Map"
            value={`${mapDetails?.zoomLevel || ''}`}
          />
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            margin: '20px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <TextField
            variant="standard"
            label="Lat"
            onChange={(e) => handleChange(e, 'lat')}
            value={lat}
            error={latError.length > 0}
            helperText={latError && latError}
          />
          <TextField
            variant="standard"
            label="Lon"
            onChange={(e) => handleChange(e, 'lon')}
            value={lon}
            error={lonError.length > 0}
            helperText={lonError && lonError}
          />
          <TextField
            variant="standard"
            label="zoom level"
            onChange={(e) => handleChange(e, 'zoom')}
            value={zoom}
            error={zoomError.length > 0}
            helperText={zoomError && zoomError}
            sx={{
              '& .MuiFormHelperText-root': {
                maxWidth: '167px',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center,',
          }}
        >
          <Button disabled={!disableSubmitButton()} onClick={handleSubmit}>
            submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
