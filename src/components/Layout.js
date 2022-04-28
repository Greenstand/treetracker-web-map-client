import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { blueGrey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
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
    boxShadow:
      '20px 0px 17px -14px rgb(0 0 0 / 32%), 10px 0px 15px 1px rgb(0 0 0 / 14%), 10px 0px 20px 3px rgb(0 0 0 / 12%)',
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

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blueGrey[900]),
    backgroundColor: blueGrey[900],
    '&:hover': {
      backgroundColor: blueGrey[800],
    },
  }));

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
            <ColorButton
              style={{maxWidth: '55px', maxHeight: '55px', minWidth: '55px', minHeight: '55px'}}
              sx={{ borderRadius: '15px' }}>
              <img src={max} alt="max" />
            </ColorButton>
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
            <ColorButton
              style={{maxWidth: '55px', maxHeight: '55px', minWidth: '55px', minHeight: '55px'}}
              sx={{ borderRadius: '15px' }}
              onClick={handleZoomIn}>
              <img src={zoomIn} alt="zoom in" />
            </ColorButton>
            <ColorButton
              style={{maxWidth: '55px', maxHeight: '55px', minWidth: '55px', minHeight: '55px'}}
              sx={{ borderRadius: '15px' }}
              onClick={handleZoomOut}>
              <img src={zoomOut} alt="zoom in" />
            </ColorButton>
          </Box>
          <App />
        </Box>
      </Box>
    </Box>
  );
}

