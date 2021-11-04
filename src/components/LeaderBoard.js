import { Avatar, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  rectangle69: {
    position: 'relative',
    height: '168px',
    width: '208px',
    borderRadius: '16px',
  },
  rectangle81: {
    position: 'relative',
    top: '-48px',
    left: '-9367',
    height: '164px',
    width: '160px',
    borderRadius: '16px',
    background:
      'linear-gradient(111.63deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.0075) 100%)',
    boxSizing: 'border-box',
    boxShadow: '0px 4px 20px rgba(255, 165, 0, 0.3)',
    backdropFilter: 'blur(30px)',
  },
  profileImage: {
    position: 'relative',
    height: '110px',
    width: '110px',
  },
  text1: {
    color: '#FFFFFF',
  },
  planter: {
    fontFamily: 'Montserrat',
    fontSize: '22px',
    lineHeight: '28px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  content: {
    fontFamily: 'Montserrat',
    fontSize: '26px',
    lineHeight: '28px',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  eclipse: {
    top: '-60px',
    position: 'relative',
    height: '120px',
    width: '120px',
    background: '#FFFFFF',
  },
  rating: {
    fontFamily: 'Montserrat',
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 700,
  },
  colorPalette1: {
    background: 'linear-gradient(139.31deg, rgba(71, 75, 79, 0.2) 0%, rgba(255, 165, 0, 0.9) 85.71%)',
    "& .inner1": {
      background: 'linear-gradient(111.63deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.0075) 100%)',
    }
  },
  colorPalette2: {
    background: 'linear-gradient(139.31deg, rgba(71, 75, 79, 0.2) 0%, rgba(97, 137, 47, 0.9) 77.54%)',
    '& .inner2': {
      background: 'linear-gradient(111.63deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.0075) 100%)'
    }
  },
  colorPalette3: {
    background: 'linear-gradient(139.31deg, rgba(71, 75, 79, 0.2) 0%, #FF7A00 82.18%)',
    '& .inner3': {
      background: 'linear-gradient(111.63deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.0075) 100%)',
    }
  }

}));

function LeaderBoard({ props }) {
  const classes = useStyles();

  return (
    <Grid>
      <Box>
        <Box className={`${classes.rectangle69} ${classes.colorPalette1}`} align="center" top="100px">
          <Avatar className={classes.eclipse}>
            <Avatar
              className={classes.profileImage}
              alt="alt name"
              src="/src/images/image26.jpg"
            />
          </Avatar>
          <Box id='inner1' className={classes.rectangle81}>
            <Box className={classes.planter}>Planter</Box>
            <Box className={classes.content}>Onega Innocent G</Box>
            <Box className={classes.rating}>
              Rating
              <br></br>
              4.8
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box className={`${classes.rectangle69} ${classes.colorPalette2}`}
          align="center"
          left='220px'
          top='-100px'
        >
          <Avatar className={classes.eclipse}>
            <Avatar
              className={classes.profileImage}
              alt="alt name"
              src="/src/images/image27.jpg"
            />
          </Avatar>
          <Box id='inner2' className={classes.rectangle81} >
            <Box className={classes.planter}>Planter</Box>
            <Box className={classes.content}>Samwell A</Box>
            <Box className={classes.rating}>
              Rating
              <br></br>
              4.8
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box className={`${classes.rectangle69} ${classes.colorPalette3}`}
          align="center"
          left="440px"
          top="-230px"
          background="linear-gradient(139.31deg, rgba(71, 75, 79, 0.2) 0%, rgba(97, 137, 47, 0.9) 77.54%);
          "
        >
          <Avatar className={classes.eclipse}>
            <Avatar
              className={classes.profileImage}
              alt="alt name"
              src="/src/images/image25.jpg"
            />
          </Avatar>
          <Box id="inner3" className={classes.rectangle81}  >
            <Box className={classes.planter}>Planter</Box>
            <Box className={classes.content}>Ian C</Box>
            <Box className={classes.rating}>
              Rating
              <br></br>
              4.8
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default LeaderBoard;
