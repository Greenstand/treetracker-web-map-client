import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme, size) => ({
  SliderContainer: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    marginTop: theme.spacing(4.5),
    marginBottom: theme.spacing(14.25),
    [theme.breakpoints.down('sm')]: {
      left: theme.spacing(-4),
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(14.25),
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
    padding: theme.spacing(8, 0),
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
      padding: theme.spacing(0, 4),
    },
  },

  Img: {
    borderRadius: '8px',
    transition: 'transform .5s',
    width: '100%',
    height: '100%',
    minWidth: size === 'small' ? '144px' : '208px',
    [theme.breakpoints.down('sm')]: {
      minWidth: size === 'small' ? '144px' : '152px',
    },
  },
  arrow: {
    bottom: '33%',
    zIndex: 3,
    position: 'absolute',
    minWidth: '35px',
    height: '75px',
    background: theme.palette.nearBlack.main,
    border: 'none',
    opacity: 0.7,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.nearBlack.main,
    },
    cursor: 'pointer',
    padding: '0',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
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
    height: size === 'small' ? '144px' : '208px',
    transition: 'all .5s',
    scrollSnapAlign: 'center',
    scrollBehavior: 'smooth',
    position: 'relative',
    '&:hover': {
      transform: 'scale(1.2)',
      zIndex: 3,
    },
    '&:hover > *': {
      opacity: 1,
    },
    [theme.breakpoints.down('sm')]: {
      width: size === 'small' ? '144px' : '152px',
      height: size === 'small' ? '144px' : '152px',
    },
  },
}));

export { useStyles };
