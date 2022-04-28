import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import { makeStyles } from 'models/makeStyles';
import max from '../images/max.svg';
import zoomIn from '../images/zoom-in.svg';
import zoomOut from '../images/zoom-out.svg';
import { useMapContext } from '../mapContext';

const App = dynamic(() => import('./App'), { ssr: false });
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100vh',
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
    overflowY: 'auto',
    display: 'flex',
    // boxShadow:
    //   '20px 0px 17px -14px rgb(0 0 0 / 32%), 10px 0px 15px 1px rgb(0 0 0 / 14%), 10px 0px 20px 3px rgb(0 0 0 / 12%)',
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  right: {
    width: '50%',
    zIndex: 998,
    background: 'gray',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '0%',
    },
  },
}));

export default function Layout({ children }) {
  const mapContext = useMapContext();
  const { classes } = useStyles();
  function handleFullScreen() {
    // navigate to /container page through next.js's api
    const url = new URL(window.location.href);
    url.searchParams.set('embed', true);
    window.location.href = url.toString();
  }

  function handleZoomIn() {
    mapContext.map.map.zoomIn();
  }

  function handleZoomOut() {
    mapContext.map.map.zoomOut();
  }

  return (
    <Box className={classes.root}>
      <Navbar />
      <Box className={classes.main}>
        <Paper elevation={11} className={classes.left}>
          {children}
        </Paper>
        <Box className={classes.right}>
          <Box
            onClick={handleFullScreen}
            sx={{
              position: 'absolute',
              zIndex: '9999',
              top: '0px',
              right: '0px',
              margin: '20px',
              cursor: 'pointer',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="fullscreen" src={max} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              zIndex: '9999',
              bottom: '0px',
              right: '0px',
              margin: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box onClick={handleZoomIn}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="zoom-in" src={zoomIn} />
            </Box>
            <Box onClick={handleZoomOut}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="zoom-out" src={zoomOut} />
            </Box>
          </Box>
          <App />
        </Box>
      </Box>
    </Box>
  );
}
