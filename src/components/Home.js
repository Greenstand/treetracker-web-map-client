import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import backgroundImage from '../images/bg.png';
import Link from './Link';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    background: `center / cover no-repeat url(${backgroundImage})`,
    height: '100%',
  },
  contentContainer: {
    width: '75%',
    margin: '0 auto',
    color: 'white',
    height: '100%',
    lineHeight: '140%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&>*': {
      marginBottom: theme.spacing(5),
    },
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {},
  slogan: {},
  button: {
    textTransform: 'none',
    marginRight: 20,
  },
  findATreeButton: {
    textTransform: 'none',
    background: theme.palette.success.main,
  },
}));

export default function Home() {
  const classes = useStyles();

  const Buttons = () => (
    <Box className={classes.buttonsContainer}>
      <Button variant="outlined" color="primary" className={classes.button}>
        Learn more
      </Button>
      <Link href="/top">
        <Button variant="contained" className={classes.findATreeButton}>
          Let&apos;s Find a Tree
        </Button>
      </Link>
    </Box>
  );

  return (
    <Box className={classes.pageContainer}>
      <Box className={classes.contentContainer}>
        <Typography variant="h3" className={classes.welcome}>
          Welcome to TreeTracker
        </Typography>
        <Typography variant="h1" className={classes.slogan}>
          Come explore the global reforestation effort.
        </Typography>
        <Buttons />
      </Box>
    </Box>
  );
}
