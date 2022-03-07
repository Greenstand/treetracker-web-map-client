import OpenWithIcon from '@mui/icons-material/OpenWith';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import { makeStyles } from 'models/makeStyles';
import Navbar from './Navbar';

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
}));

export default function Layout({ children }) {
  const { classes } = useStyles();
  function handleFullScreen() {
    // navigate to /container page through next.js's api
    const url = new URL(window.location.href);
    url.searchParams.set('embed', true);
    window.location.href = url.toString();
  }
  return (
    <>
      <Box className={classes.root}>
        <Navbar />
        <Box className={classes.main}>
          <Paper className={classes.left}>{children}</Paper>
          <Box className={classes.right}>
            <App />
          </Box>
        </Box>
      </Box>
      <Fab
        onClick={handleFullScreen}
        sx={{
          position: 'absolute',
          zIndex: '9999',
          bottom: '0px',
          right: '0px',
          margin: '20px',
        }}
        color="secondary"
        aria-label="edit"
      >
        <OpenWithIcon />
      </Fab>
    </>
  );
}
