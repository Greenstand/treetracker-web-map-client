import { Box, Grid } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import OpenWithOutlinedIcon from '@mui/icons-material/OpenWithOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '672px',
    height: '628px',
    maxWidth: '100%',
    borderRadius: '16px',
    position: 'relative',
    marginTop: '20px',
    [theme.breakpoints.down('md')]: {
      height: '328px',
    },
  },
  image: {
    zIndex: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    objectFit: 'cover',
    borderRadius: '16px',
  },
  ContainerIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '177px',
    height: '72px',
    color: `${theme.palette.primary.main}`,
    background: 'rgba(71, 75, 79, 0.6)',
    backdropFilter: 'blur(25px)',
    borderRadius: '16px',
    position: 'absolute',
    zIndex: 3,
    top: '20px',
    left: '24px',
    [theme.breakpoints.down('lg')]: {
      width: '130px',
      height: '50px',
      left: '9px',
    },
  },
  dateTitle: {
    fontSize: '12px',
    fontFamily: 'Lato',
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '0.04em',
    padding: 0,
    [theme.breakpoints.down('lg')]: {
      fontSize: '9px',
    },
  },
  year: {
    fontSize: '20px',
    fontFamily: 'Lato',
    margin: 0,
    fontWeight: 800,
    [theme.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  },
  Icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '22px',
    [theme.breakpoints.down('lg')]: {
      marginRight: '10px',
    },
  },
  ContainerDate: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  containerOpenWithOutlinedIcon: {
    position: 'absolute',
    top: '20px',
    right: '24px',
    width: '70px',
    height: '70px',
    background: 'rgba(71, 75, 79, 0.6)',
    backdropFilter: 'blur(30px)',
    borderRadius: '16px',
    zIndex: 3,
    [theme.breakpoints.down('lg')]: {
      width: '50px',
      height: '50px',
    },
  },
  openWithOutlinedIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary.main,
    width: '100%',
    height: '100%',
  },
  containerFavorite: {
    position: 'absolute',
    width: '86px',
    height: '56px',
    left: '20px',
    bottom: '20px',
    zIndex: 3,
    cursor: 'pointer',
    [theme.breakpoints.down('lg')]: {
      width: '40px',
      height: '26px',
      bottom: '30px',
    },
  },
  wrapperFavorite: {
    background: 'rgba(71, 75, 79, 0.6)',
    backdropFilter: 'blur(30px)',
    color: theme.palette.primary.main,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      padding: 9,
    },
  },
  favorite: {
    color: theme.palette.primary.main,
    fontSize: '30px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '20px',
    },
  },
  likes: {
    color: theme.palette.primary.main,
    margin: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  },
  openWithIcon: {
    color: theme.palette.primary.main,
    fontSize: '35px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '25px',
    },
  },
  cameraIcon: {
    fontSize: '35px',
    [theme.breakpoints.down('lg')]: {
      fontSize: '25px',
    },
  },
}));

function CustomImageWrapper({ imageUrl, timeCreated, likes }) {
  const { classes } = useStyles();

  const [isShown, setIsShown] = React.useState(false);

  const createdAt = new Date(timeCreated);
  const dayOfWeek = createdAt.getDay();
  const year = createdAt.getFullYear();
  const month = createdAt.getMonth();

  const handleHoverEnter = () => {
    setIsShown(true);
  };
  const handleHoverLeave = () => {
    setIsShown(false);
  };

  return (
    <Box
      className={classes.container}
      onMouseEnter={() => handleHoverEnter()}
      onMouseLeave={() => handleHoverLeave()}
    >
      {isShown && (
        <Grid className={classes.ContainerIcon}>
          <div className={classes.Icon}>
            <CameraAltOutlinedIcon className={classes.cameraIcon} />
          </div>
          <div className={classes.ContainerDate}>
            <div className={classes.dateTitle}>Photo taken on</div>
            <div className={classes.year}>
              {dayOfWeek}/{month}/{year}
            </div>
          </div>
        </Grid>
      )}
      {isShown && (
        <Grid className={classes.containerOpenWithOutlinedIcon}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={imageUrl}
            className={classes.openWithOutlinedIcon}
          >
            <OpenWithOutlinedIcon className={classes.openWithIcon} />
          </a>
        </Grid>
      )}
      {isShown && (
        <Grid className={classes.containerFavorite}>
          <div className={classes.wrapperFavorite}>
            <FavoriteBorderOutlinedIcon className={classes.favorite} />
            <div className={classes.likes}>{likes}</div>
          </div>
        </Grid>
      )}
      <img src={imageUrl} alt="tree image" className={classes.image} />
    </Box>
  );
}
export default CustomImageWrapper;
