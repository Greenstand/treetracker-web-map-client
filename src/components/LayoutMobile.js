import { SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import ZoomIn from 'images/zoom-in.svg';
import ZoomOut from 'images/zoom-out.svg';
import { useMapContext } from 'mapContext';
import { makeStyles } from 'models/makeStyles';
import SearchFilter from './SearchFilter';
import Timeline from './Timeline';

const App = dynamic(() => import('./App'), { ssr: false });
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const Drawer = dynamic(() => import('./Drawer'), { ssr: false });

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
  },
  left: {
    width: '50%',
    height: '100%',
    zIndex: 999,
    background: theme.palette.background.default,
    overflowY: 'auto',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  right: {
    width: '50%',
    zIndex: 998,
    background: 'gray',
    [theme.breakpoints.down('sm')]: {
      width: '0%',
    },
  },
  behind: {},
  above: {},
}));

const Layout = forwardRef(({ children }, ref) => {
  const { classes } = useStyles();
  const mapContext = useMapContext();

  function handleZoomIn() {
    mapContext.map.map.zoomIn();
  }

  function handleZoomOut() {
    mapContext.map.map.zoomOut();
  }

  return (
    <Box
      className={classes.root}
      sx={{
        height: () => `${window.innerHeight  }px`,
      }}
    >
      <Navbar />
      <Box sx={{ position: 'relative', width: 1, height: 1 }}>
        <Box
          sx={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }}
        >
          <App />
        </Box>
        <Drawer outerRef={ref}>{children}</Drawer>
        <Box className={classes.right}>
          <Timeline />
          <Box
            sx={{
              position: 'absolute',
              zIndex: '996',
              bottom: '0px',
              right: '0px',
              margin: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box onClick={handleZoomIn}>
              <SvgIcon
                alt="zoom-in"
                component={ZoomIn}
                inheritViewBox
                sx={{ height: 52, width: 52 }}
              />
            </Box>
            <Box marginBottom="2rem" onClick={handleZoomOut}>
              <SvgIcon
                alt="zoom-out"
                component={ZoomOut}
                inheritViewBox
                sx={{ width: 52, height: 52 }}
              />
            </Box>
          </Box>
        </Box>
        {/* <Box
          sx={{
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            padding: '10px 10px',
            '&>div': {
              backgroundColor: 'white',
            },
          }}
        >
          <SearchFilter />
        </Box> */}
      </Box>
    </Box>
  );
});

Layout.displayName = 'LayoutMobile';
export default Layout;
