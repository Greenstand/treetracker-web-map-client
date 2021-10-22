import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import backgroundImage from '../images/bg.png';
import Link from './Link';

const useStyles = makeStyles(() => ({
  pageContainer: {
    background: `center / cover no-repeat url(${backgroundImage})`,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    color: 'white',
    width: '75%',
    margin: '0 auto',
  },
  welcome: {
    fontFamily: 'Montserrat !important',
    fontSize: '20px !important',
    fontStyle: 'normal !important',
    fontWeight: '700 !important',
    lineHeight: '26px !important',
    letterSpacing: '0em !important',
    textAlign: 'left !important',
  },
  slogan: {
    fontFamily: 'Montserrat !important',
    fontSize: '40px !important',
    fontStyle: 'normal !important',
    fontWeight: '700 !important',
    lineHeight: '63px !important',
    letterSpacing: '0em !important',
    textAlign: 'left !important',
  },
  button: {
    background: '#86C232',
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <Grid className={classes.pageContainer}>
      <Grid container className={classes.contentContainer}>
        <Typography variant="h4" className={classes.welcome}>
          Welcome to TreeTracker
        </Typography>
        <Typography variant="h2" className={classes.slogan}>
          Come explore the global reforestation effort.
        </Typography>
        <Grid container>
          <Button variant="outlined" color="primary">
            Learn more
          </Button>
          <Box sx={{ width: 20 }} component="span" />
          <Link href="/top">
            <Button variant="contained" className={classes.button}>
              Let&apos;s Find a Tree
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Home;
