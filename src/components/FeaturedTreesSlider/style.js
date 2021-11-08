import { makeStyles } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
  SliderContainer: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  SliderImgContainer: {
    display: 'flex',
    gap: '8px',
    position: 'relative',
    overflowX: 'scroll',
    scrollBehavior: 'smooth',
    scrollSnapType: 'x mandatory',
    padding: '2rem 0',
    scrollPadding: '0 50%',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&:hover $Card:hover': {
      overflow: 'none !impornant',
      scrollSnapType: 'none',
    },
  },

  Img: {
    borderRadius: '8px',
    transition: 'transform .5s',
    width: '100%',
    height: '100%',
    minWidth: '208px',
  },
  GoRight: {
    right: '0px',
    bottom: '33%',
    zIndex: '3',
    position: 'absolute',
    minWidth: '35px',
    height: '75px',
    background: '#222629B2',
    border: 'none',
    color: 'white',
    borderRadius: '40px 0 0 40px ',
    cursor: 'pointer',
    padding: '0',
    '&:hover': {
      background: '#222629B2',
    },
  },
  GoLeft: {
    left: '0px',
    bottom: '33%',
    zIndex: '3',
    position: 'absolute',
    minWidth: '35px',
    height: '75px',
    background: '#222629B2',
    border: 'none',
    color: 'white',
    borderRadius: '0 40px 40px 0',
    cursor: 'pointer',
    padding: '0',
    '&:hover': {
      background: '#222629B2',
    },
  },
  Title: {
    position: 'absolute',
    bottom: '0',
    background: '#474B4FB2',
    width: 'inherit',
    height: '30px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 800,
    borderRadius: '0 0 8px 8px',
    opacity: 0,
    zIndex: 3,
    transition: 'all .5s',
  },
  Card: {
    width: '208px',
    height: '208px',
    transition: 'all .5s',
    scrollSnapAlign: 'center',
    scrollBehavior: 'smooth',
    '&:hover': {
      transform: 'scale(1.2)',
      position: 'relative',
      zIndex: 2,
      '& $Title': {
        opacity: 1,
      },
    },
  },
}));

export { useStyles };
