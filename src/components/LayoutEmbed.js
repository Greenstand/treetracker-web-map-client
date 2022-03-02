import OpenWithIcon from '@mui/icons-material/OpenWith';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import dynamic from 'next/dynamic';
import React from 'react';
import SearchFilter from './SearchFilter';
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
  function handleFullScreen() {
    // navigate to /container page through next.js's api
    window.location.href = window.location.href.replace(/embed=true/, '');
  }

  function handleDrawerToggle() {
    setIsDrawerOpen(!isDrawerOpen);
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
              width: '499px',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '499px',
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={isDrawerOpen}
          >
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
          </Drawer>
          {isDrawerOpen && (
            <Box
              onClick={handleDrawerToggle}
              sx={{
                position: 'absolute',
                top: '0',
                left: '499px',
                zIndex: '999',
                background: 'white',
                fontSize: '32px',
              }}
            >
              X
            </Box>
          )}
        </>
      )}

      {!isDrawerOpen && (
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
          <Box
            onClick={handleDrawerToggle}
            sx={{
              fontSize: '32px',
            }}
          >
            X
          </Box>
        </Box>
      )}

      {isFloatingDisabled && (
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
        <Box
          sx={{
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'roboto',
            flexDirection: 'column',
            borderRadius: '22px',
            padding: '10px',
            fontSize: '12px',
          }}
        >
          <Box id="embed-logo-container">{/* logo */}</Box>
          <Box
            sx={{
              height: 'fit-content',
            }}
          >
            POWERED BY GREENSTAND
          </Box>
        </Box>
        <Fab
          onClick={handleFullScreen}
          sx={{}}
          color="secondary"
          aria-label="edit"
        >
          <OpenWithIcon />
        </Fab>
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
