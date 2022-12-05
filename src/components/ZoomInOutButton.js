import { SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import ZoomIn from '../images/zoom-in.svg';
import ZoomOut from '../images/zoom-out.svg';
import { useMapContext } from '../mapContext';

export default function ZoomInOutButton() {
  const mapContext = useMapContext();
  const [isEnabledZoomIn, setIsEnabledZoomIn] = useState(false);
  const [isEnabledZoomOut, setIsEnabledZoomOut] = useState(true);

  useEffect(() => {
    const checkZoomEnable = () => {
      if (mapContext.map) {
        const currMap = mapContext.map.map;
        setIsEnabledZoomIn(currMap.getZoom() === currMap.getMaxZoom());
        setIsEnabledZoomOut(currMap.getZoom() === currMap.getMinZoom());
      }
    };
    if (mapContext.map) {
      (async () => {
        const { Map } = await import('treetracker-web-map-core');
        mapContext.map.on(Map.REGISTERED_EVENTS.MOVE_END, () => {
          checkZoomEnable();
        });
      })();
    }
  }, [mapContext, mapContext.map]);

  function handleZoomIn() {
    const currMap = mapContext.map.map;
    if (currMap.getZoom() === currMap.getMaxZoom()) return;
    currMap.zoomIn();
  }

  function handleZoomOut() {
    const currMap = mapContext.map.map;
    if (currMap.getZoom() === currMap.getMinZoom()) return;
    currMap.zoomOut();
  }

  return (
    <div>
      <Box
        onClick={handleZoomIn}
        sx={{
          path: { fill: isEnabledZoomIn ? 'grey' : 'white' },
          cursor: isEnabledZoomIn ? 'default' : 'pointer',
        }}
      >
        <SvgIcon
          alt="zoom-in"
          component={ZoomIn}
          inheritViewBox
          sx={{ width: 52, height: 52 }}
        />
      </Box>
      <Box
        onClick={handleZoomOut}
        sx={{
          '& svg': { display: 'block' },
          path: { fill: isEnabledZoomOut ? 'grey' : 'white' },
          cursor: isEnabledZoomOut ? 'default' : 'pointer',
        }}
      >
        <SvgIcon
          alt="zoom-out"
          component={ZoomOut}
          inheritViewBox
          sx={{ width: 52, height: 52 }}
        />
      </Box>
    </div>
  );
}
