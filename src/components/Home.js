import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import Link from './Link';

const backgroundImage = '/images/bg.png';
const useStyles = makeStyles()((theme) => ({
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
    paddingTop: '15vh',
    '&>*': {
      marginBottom: theme.spacing(5),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      padding: '1rem',
      boxSizing: 'border-box',
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
  },
  slogan: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.9rem',
      lineHeight: '2.5rem',
    },
  },
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
  const { classes } = useStyles();

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
        <Box sx={{ height: 1000 }} />
      </Box>
    </Box>
  );
}
