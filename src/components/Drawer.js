import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Paper } from '@mui/material';
import * as d3 from 'd3';
import log from 'loglevel';
import React from 'react';

export default function Drawer(props) {
  const { children } = props;
  const rootRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const contentRef = React.useRef(null);

  function handleOpen() {
    log.warn('on click!');
    rootRef.current.style.transform = 'translateY(500px)';
    buttonRef.current.style.transform = 'translateY(45px)';
  }

  function handleClose() {
    buttonRef.current.style.transform = 'translateY(0px)';
  }

  const handleTouchStart = React.useCallback((event) => {
    log.error('touch start: ', event);
    // event.stopPropagation();
    log.warn(
      'rootRef.current.style.transform: ',
      rootRef.current.style.transform,
    );
    const y = rootRef.current.style.transform?.match(/translateY\((.*)px\)/);
    let startTranslateY = 0;
    if (y) {
      startTranslateY = parseInt(y[1], 10);
    }
    const touchCache = {
      startY: event.touches[0].pageY,
      startTranslateY,
      lastTime: Date.now(),
    };
    log.warn('start with: ', touchCache);
    rootRef.current.touchCache = touchCache;
    // rootRef.current.style.transform = 'translateX(0)';
  }, []);

  const handleTouchMove = React.useCallback((event) => {
    // log.trace("touch move: ", event);
    const offsetY = event.touches[0].pageY - rootRef.current.touchCache.startY;
    // log.trace("offsetY: ", offsetY);
    const { touchCache } = rootRef.current;
    const translateY = Math.max(touchCache.startTranslateY + offsetY, 0);
    if (touchCache.lastPageY) {
      const deltaY = event.touches[0].pageY - touchCache.lastPageY;
      const velocity = deltaY / (Date.now() - touchCache.lastTime);
      log.warn('deltaY:', deltaY, 'velocity:', velocity);
      touchCache.lastVelocity = velocity;
    }
    touchCache.lastTime = Date.now();
    touchCache.lastTranslateY = translateY;
    touchCache.lastPageY = event.touches[0].pageY;
    rootRef.current.style.transform = `translateY(${translateY}px)`;
    if (translateY > 10) {
      rootRef.current.style.borderRadius = '16px 16px 0 0';
    }
    // event.stopPropagation();
  }, []);

  const handleTouchEnd = React.useCallback((event) => {
    log.warn('touch end: ', event);
    const { touchCache } = rootRef.current;
    log.warn('last velocity:', touchCache.lastVelocity);
    if (touchCache.lastVelocity < -0.4) {
      rootRef.current.style.transform = `translateY(0px)`;
      rootRef.current.style.borderRadius = '0';
      contentRef.current.style.height = '100%';
      return;
    }
    if (touchCache.lastVelocity > 0.4) {
      rootRef.current.style.transform = `translateY(${window.innerHeight}px)`;
      handleClose();
      contentRef.current.style.height = 'auto';
      return;
    }
    log.warn(
      'rootRef.current.style.transform: ',
      rootRef.current.style.transform,
    );
    const m = rootRef.current.style.transform?.match(/translateY\((.*)px\)/);
    if (m) {
      const y = parseInt(m[1], 10);
      if (y < 150) {
        rootRef.current.style.transform = `translateY(0px)`;
        rootRef.current.style.borderRadius = '0';
        contentRef.current.style.height = '100%';
        return;
      }
      contentRef.current.style.height = 'auto';
      if (y > window.innerHeight - 150) {
        rootRef.current.style.transform = `translateY(${window.innerHeight}px)`;
        handleClose();
      }
    }
  }, []);

  React.useEffect(() => {
    rootRef.current.style.transform = 'translateY(500px)';
    rootRef.current.buttonTouchCache = {
      startY: 0,
    };
    // buttonRef.current.touchCache = {};
  }, []);

  const handleButtonTouchStart = React.useCallback((event) => {
    log.warn('button touch start: ', event);
    rootRef.current.buttonTouchCache.startY = event.touches[0].pageY;
    // // log.trace("offsetY: ", offsetY);
    // const { touchCache } = rootRef.current;
    // const translateY = touchCache.startTranslateY + offsetY;
    // if (touchCache.lastPageY) {
    //   const deltaY = event.touches[0].pageY - touchCache.lastPageY;
    //   const velocity = deltaY / (Date.now() - touchCache.lastTime);
    //   log.warn("deltaY:", deltaY, "velocity:", velocity);
    //   touchCache.lastVelocity = velocity;
    // }
    // touchCache.lastTime = Date.now();
    // touchCache.lastTranslateY = translateY;
    // touchCache.lastPageY = event.touches[0].pageY;
    // rootRef.current.style.transform = `translateY(${translateY}px)`;
  }, []);

  const handleButtonTouchMove = React.useCallback((event) => {
    log.warn('button touch move: ', event);
    const offsetY =
      event.touches[0].pageY - rootRef.current.buttonTouchCache.startY;
    // log.trace("offsetY: ", offsetY);
    const translateY = Math.max(offsetY, -150);
    buttonRef.current.style.transform = `translateY(${translateY}px)`;

    if (translateY <= -150) {
      log.warn('open...');
      handleOpen();
    }
  }, []);

  const handleButtonTouchEnd = React.useCallback((event) => {
    log.warn('button touch end: ', event);
    buttonRef.current.style.transform = `translateY(0px)`;
  }, []);

  React.useEffect(() => {
    log.warn('mount listener...');
    rootRef.current.addEventListener('touchstart', handleTouchStart);
    rootRef.current.addEventListener('touchmove', handleTouchMove);
    rootRef.current.addEventListener('touchend', handleTouchEnd);
    buttonRef.current.addEventListener('touchstart', handleButtonTouchStart);
    buttonRef.current.addEventListener('touchmove', handleButtonTouchMove);
    buttonRef.current.addEventListener('touchend', handleButtonTouchEnd);

    // contentRef.current.addEventListener("touchstart", e => { e.stopPropagation(); }, { passive: false })
    // contentRef.current.addEventListener("touchmove", e => { e.stopPropagation(); }, { passive: false })
    // contentRef.current.addEventListener("touchend", e => { e.stopPropagation(); }, { passive: false })

    return () => {
      if (rootRef.current === null) return;
      if (buttonRef.current === null) return;
      log.warn('unmount listener...');
      rootRef.current.removeEventListener('touchstart', handleTouchStart);
      rootRef.current.removeEventListener('touchmove', handleTouchMove);
      rootRef.current.removeEventListener('touchend', handleTouchEnd);
      buttonRef.current.removeEventListener(
        'touchstart',
        handleButtonTouchStart,
      );
      buttonRef.current.removeEventListener('touchmove', handleButtonTouchMove);
      buttonRef.current.removeEventListener('touchend', handleButtonTouchEnd);
      // contentRef.current.removeEventListener("touchstart");
      // contentRef.current.addEventListener("touchmove");
      // contentRef.current.addEventListener("touchend");
    };
  }, [
    rootRef,
    buttonRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleButtonTouchStart,
    handleButtonTouchMove,
    handleButtonTouchEnd,
  ]);

  return (
    <>
      <Paper
        ref={buttonRef}
        elevation={11}
        square
        sx={{
          position: 'fixed',
          left: 0,
          bottom: -255,
          width: 1,
          height: 300,
          transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          transform: 'translateY(45px)',
          zIndex: '998',
        }}
      >
        <Box
          sx={{
            width: 1,
            height: 45,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ExpandLessIcon
            sx={{
              height: 42,
              width: 42,
              color: (t) =>
                d3
                  .color(t.palette.greyLight.main)
                  .copy({ opacity: 0.7 })
                  .formatRgb(),
            }}
          />
          <Box
            sx={{
              width: 1,
              height: 1,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              pl: '10px',
            }}
            id="drawer-title-container-min"
            onClick={handleOpen}
          />
        </Box>
      </Paper>
      <Paper
        ref={rootRef}
        elevation={10}
        className="drawer-root"
        sx={{
          position: 'absolute',
          borderRadius: '16px 16px 0 0 ',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          transition: 'transform 125ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          // transform: 'translateY(500px)',
          zIndex: '999',
        }}
      >
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

        <Box
          ref={contentRef}
          sx={{
            position: 'relative',
            overflow: 'scroll',
            minHeight: 200,
            height: 'auto',
          }}
          className="drawer-content"
        >
          {children}
        </Box>
      </Paper>
    </>
  );
}
