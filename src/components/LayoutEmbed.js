import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import { Paper, Typography, SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import SearchFilter from './SearchFilter';
import Timeline from './Timeline';
import { useEmbed } from '../hooks/globalHooks';
import LogoIcon from '../images/greenstand_logo_full.png';
import MinIcon from '../images/min.svg';
import ZoomIn from '../images/zoom-in.svg';
import ZoomOut from '../images/zoom-out.svg';
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

export default function Layout({
  children,
  nextExtraIsEmbed,
  nextExtraIsEmbedCallback,
  isFloatingDisabled,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const [toggleButtonPosition, setToggleButtonPosition] = React.useState(0);
  const isEmbed = useEmbed();
  // const { _classes } = useStyles();
  const mapContext = useMapContext();
  function handleFullScreen() {
    nextExtraIsEmbedCallback(!nextExtraIsEmbed);
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

  React.useEffect(() => {
    setToggleButtonPosition((prevPosition) => {
      if (prevPosition === 0) return 568; // width of the drawer
      return 0;
    });
  }, [isDrawerOpen]);

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
                  overflowY: 'scroll',
                  height: '100vh',
                }}
              >
                {children}
              </Box>
            </Box>
          </Drawer>
          <Paper
            onClick={handleDrawerToggle}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              top: 13,
              transform: `translate(${toggleButtonPosition}px, 0)`,
              transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
              width: 23,
              height: 48,
              display: 'flex',
              borderRadius: '0px 5px 5px 0',
              zIndex: 1200,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isDrawerOpen ? <ArrowLeft /> : <ArrowRight />}
          </Paper>
        </>
      )}
      {isFloatingDisabled && (
        <Box
          sx={{
            display: 'none',
          }}
        >
          {children}
        </Box>
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
      {isEmbed || (
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
          <SvgIcon
            component={MinIcon}
            inheritViewBox
            sx={{ height: 52, width: 52 }}
          />
        </Box>
      )}
      <Timeline />
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
              <Link href="https://greenstand.org">
                <a target="_blank">
                  <img src={LogoIcon} width="80px" />
                </a>
              </Link>
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
            {}
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
            }}
          >
            {}
            <SvgIcon
              alt="zoom-out"
              component={ZoomOut}
              inheritViewBox
              sx={{ width: 52, height: 52 }}
            />
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
