import { Global } from '@emotion/react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const Root = styled('div')(() => ({
  height: '100%',
}));

const StyledBox = styled(Box)(() => ({}));

function Drawer(props) {
  const { children } = props;
  const [open, setOpen] = useState(true);
  const [hasHeight, setHasHeight] = useState(300);

  useEffect(() => {
    if (hasHeight <= 0) {
      setHasHeight(0);
    } else if (hasHeight >= 500) {
      /* Close the SwipeableDrawer if the hasHeight is equal or greater than 500 */
      setOpen(false);
    } else {
      /* return any value the hasHeight state has */
      setHasHeight(hasHeight);
    }
  }, [hasHeight]);

  const handleTouch = (event) => {
    event.stopPropagation();

    const touches = event.targetTouches && event.targetTouches[0];

    setHasHeight(Math.round(touches?.clientY || hasHeight));
  };

  function handleClickBottom() {
    setOpen(true);
    setHasHeight(300);
  }
  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: '90vh',
            overflow: 'visible',
            transform: `translate(0px, ${hasHeight}px) !important`,
          },
        }}
      />
      {!open && (
        <StyledBox
          sx={{
            position: 'absolute',
            top: -56,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            right: 0,
            left: 0,
          }}
        >
          <Paper
            elevation="11"
            sx={{
              pointerEvents: 'auto',
              width: '100%',
              position: 'fixed',
              bottom: 0,
              borderRadius: '16px 16px 0 0 ',
            }}
            onClick={handleClickBottom}
          >
            <Box
              sx={{
                height: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 4,
                  backgroundColor: (t) => t.palette.text.disabled,
                  borderRadius: 3,
                  my: 4,
                }}
              />
            </Box>
          </Paper>
        </StyledBox>
      )}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen={false}
        hideBackdrop
        sx={{
          position: 'relative',
          zIndex: 900,
        }}
        ModalProps={{
          keepMounted: true,
          hideBackdrop: true,
          disableEnforceFocus: true,
          disableAutoFocus: true,
        }}
        PaperProps={{
          elevation: 11,
          sx: {
            borderRadius: '16px 16px 0 0 ',
          },
        }}
      >
        {/* <Wrapper onTouchMove={handleTouch} onMouseMove={handleTouch}>
          <StyledBox
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: [0, 4],
            }}
          >
            <Puller />
            <DrawerTitle />
          </StyledBox>
        </Wrapper> */}

        <Box
          id="drawer-header"
          sx={{
            display: 'flex',
            // marginBottom: [0, 4],
            borderRadius: '16px 16px 0 0 ',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onTouchMove={handleTouch}
          onMouseMove={handleTouch}
        >
          <Box
            sx={{
              width: 24,
              height: 4,
              backgroundColor: (t) => t.palette.text.disabled,
              borderRadius: 3,
              my: 4,
            }}
          />
          <Box
            sx={{
              width: 1,
              pointerEvents: 'none',
            }}
            id="drawer-title-container"
          />
        </Box>

        <StyledBox
          sx={{
            position: 'relative',
            overflow: 'scroll',
          }}
        >
          {children}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default Drawer;
