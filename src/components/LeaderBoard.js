import { Avatar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  rectangle69: {
    position: 'relative',
    height: '168px',
    width: '208px',
    top: '100px',
    borderRadius: '16px',
    background:
      'linear-gradient(139.31deg, rgba(71, 75, 79, 0.2) 0%, rgba(255, 165, 0, 0.9) 85.71%)',
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
    top: '-2px',
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
    top: '-59px',
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
}));

function LeaderBoard({ props }) {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.rectangle69} align="center">
        <Avatar className={classes.eclipse}>
          <Avatar
            className={classes.profileImage}
            alt="alt name"
            src="/src/images/image26.jpg"
          />
        </Avatar>
        <Box className={classes.rectangle81}>
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
  );
}

export default LeaderBoard;
