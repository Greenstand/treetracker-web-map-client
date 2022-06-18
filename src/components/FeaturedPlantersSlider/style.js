import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme, size) => ({
  SliderContainer: {
    position: 'relative',
    // width: '100%',
    overflow: 'hidden',
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    [theme.breakpoints.down('sm')]: {
      left: theme.spacing(-4),
      marginTop: theme.spacing(3),
      width: '100vw',
    },
  },
  SliderImgContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    position: 'relative',
    overflowX: 'scroll',
    scrollBehavior: 'smooth',
    scrollSnapType: 'x mandatory',
    padding: theme.spacing(8, 4),
    scrollPadding: '0 50%',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:hover $Card:hover': {
      overflow: 'none !impornant',
      scrollSnapType: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 8),
    },
  },

  Img: {
    borderRadius: '8px',
    transition: 'transform .5s',
    width: 208,
    height: 232,
    minWidth: size === 'small' ? '144px' : '208px',
    [theme.breakpoints.down('sm')]: {
      minWidth: size === 'small' ? '144px' : '152px',
    },
  },
  Title: {
    position: 'absolute',
    bottom: 0,
    backdropFilter: 'blur(12px)',
    background: '#474B4F4D',
    width: 'inherit',
    height: '30px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0 0 8px 8px',
    opacity: 0,
    transition: 'all .5s',
  },
  Card: {
    width: size === 'small' ? '144px' : '208px',
    transition: 'all .5s',
    scrollSnapAlign: 'center',
    scrollBehavior: 'smooth',
    position: 'relative',
    // '&:hover': {
    //   transform: 'scale(1.2)',
    //   zIndex: 3,
    // },
    // '&:hover > *': {
    //   opacity: 1,
    // },
    padding: theme.spacing(5),
    borderRadius: theme.spacing(4),
    boxShadow: '0px 2px 16px rgba(34, 38, 41, 0.15)',
    [theme.breakpoints.down('sm')]: {
      width: size === 'small' ? '144px' : '152px',
      height: size === 'small' ? '144px' : '152px',
    },
  },
  toolTip:
    theme.palette.mode === 'dark'
      ? {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
        }
      : {},
}));

export { useStyles };
