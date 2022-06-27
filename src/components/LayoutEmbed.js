import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import dynamic from 'next/dynamic';
import React from 'react';
import SearchFilter from './SearchFilter';
import logoIcon from '../images/logo.png';
import minIcon from '../images/min.svg';
import zoomIn from '../images/zoom-in.svg';
import zoomOut from '../images/zoom-out.svg';
import { useMapContext } from '../mapContext';
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

export default function Layout({ children, isFloatingDisabled }) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  // const { _classes } = useStyles();
  const mapContext = useMapContext();
  function handleFullScreen() {
    // navigate to /container page through next.js's api
    window.location.href = window.location.href.replace(/embed=true/, '');
  }

  function handleDrawerToggle() {
    setIsDrawerOpen(!isDrawerOpen);
  }

  function handleZoomIn() {
    mapContext.map.map.zoomIn();
  }

  function handleZoomOut() {
    mapContext.map.map.zoomOut();
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
      {!isFloatingDisabled && (
        <>
          <Drawer
            sx={{
              width: 568,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 568,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={isDrawerOpen}
            PaperProps={{
              elevation: 6,
            }}
          >
            <Box>
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: '99999',
                  top: '0px',
                  background: 'white',
                  width: 568,
                  overflow: 'scroll',
                  height: '100vh',
                }}
              >
                {children}
              </Box>
            </Box>
          </Drawer>
          {isDrawerOpen && (
            <Paper
              onClick={handleDrawerToggle}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                left: 568,
                width: 23,
                height: 48,
                display: 'flex',
                borderRadius: '0px 5px 5px 0',
                zIndex: 1200,
                top: 13,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ArrowLeft />
            </Paper>
          )}
        </>
      )}

      {false && !isDrawerOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: '999',
            backgroundColor: 'white',
            display: 'flex',
          }}
        >
          <SearchFilter />
        </Box>
      )}
      {!isDrawerOpen && (
        <Paper
          onClick={handleDrawerToggle}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            left: 0,
            width: 23,
            height: 48,
            display: 'flex',
            borderRadius: '0px 5px 5px 0',
            zIndex: 1200,
            top: 13,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ArrowRight />
        </Paper>
      )}

      {false && isFloatingDisabled && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: '999',
            backgroundColor: 'white',
            display: 'flex',
          }}
        >
          <SearchFilter />
        </Box>
      )}
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
        <img alt="fullscreen" src={minIcon} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          zIndex: '9999',
          bottom: '0px',
          right: '0px',
          margin: '20px',
          display: 'flex',
          gap: 3,
          alignItems: 'end',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '25px',
            padding: (t) => t.spacing(2, 4),
            opacity: 0.77,
          }}
        >
          <Box id="embed-logo-container">{/* logo */}</Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '10px',
              }}
              variant="caption"
            >
              Powered by
            </Typography>
            <Box
              sx={{
                width: [60, 80],
                mt: '-3px',
              }}
            >
              <img width="100%" alt="logo" src={logoIcon} />
            </Box>
          </Box>
        </Paper>
        <Box
          sx={{
            // position: 'absolute',
            zIndex: '9999',
            bottom: '0px',
            right: '0px',
            // margin: '20px',
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
      </Box>
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
