import { SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { makeStyles } from 'models/makeStyles';
import Navbar from './Navbar';
import Timeline from './Timeline';
import ZoomInOutButton from './ZoomInOutButton';
import Max from '../images/max.svg';

const App = dynamic(() => import('./App'), { ssr: false });

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

const Layout = forwardRef(
  ({ children, nextExtraIsEmbed, nextExtraIsEmbedCallback }, ref) => {
    const { classes } = useStyles();

    function handleFullScreen() {
      nextExtraIsEmbedCallback(!nextExtraIsEmbed);
    }

    return (
      <Box className={classes.root}>
        <Navbar />
        <Box className={classes.main}>
          <Paper ref={ref} elevation={11} className={classes.left}>
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
              {}
              <SvgIcon
                component={Max}
                sx={{ height: 52, width: 52 }}
                inheritViewBox
              />
            </Box>
            <Timeline />
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
              <ZoomInOutButton />
            </Box>
            <App />
          </Box>
        </Box>
      </Box>
    );
  },
);

Layout.displayName = 'Layout';
export default Layout;
