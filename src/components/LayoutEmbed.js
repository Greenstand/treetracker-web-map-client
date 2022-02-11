import OpenWithIcon from '@mui/icons-material/OpenWith';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import dynamic from 'next/dynamic';
// import { makeStyles } from 'models/makeStyles';

const App = dynamic(() => import('./App'), { ssr: false });

// const useStyles = makeStyles()((theme) => ({
//   root: {
//     height: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   main: {
//     width: '100vw',
//     display: 'flex',
//     flexDirection: 'row',
//     flexGrow: 1,
//     overflow: 'hidden',
//   },
//   left: {
//     width: '50%',
//     height: '100%',
//     zIndex: 999,
//     background: theme.palette.background.default,
//     overflowY: 'auto',
//     display: 'flex',
//     [theme.breakpoints.down('sm')]: {
//       width: '100%',
//     },
//   },
//   right: {
//     width: '50%',
//     zIndex: 998,
//     background: 'gray',
//     [theme.breakpoints.down('sm')]: {
//       width: '0%',
//     },
//   },
// }));

export default function Layout({ children }) {
  // const { _classes } = useStyles();
  function handleFullScreen() {
    // navigate to /container page through next.js's api
    window.location.href = window.location.href.replace(/embed=true/, '');
  }
  return (
    <>
      <Box
        sx={{
          width: '100%',
          zIndex: 998,
          background: 'gray',
          height: '100vh',
        }}
      >
        <App />
      </Box>
      <Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: '99999',
            top: '0px',
            background: 'white',
            width: '499px',
            overflow: 'scroll',
            height: '100vh',
          }}
        >
          {children}
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
      {/* <Box className={classes.root}>
        <Box className={classes.main}>
          <Box className={classes.left}>{children}</Box>
          <Box className={classes.right}>
          </Box>
        </Box>
      </Box> */}
      {/* <Fab
        onClick={handleFullScreen}
        sx={{
          position: 'absolute',
          zIndex: '9999',
          bottom: '0px',
          right: '0px',
          margin: '20px',
        }} color="secondary" aria-label="edit"
      >
        <OpenWithIcon />
      </Fab> */}
    </>
  );
}
