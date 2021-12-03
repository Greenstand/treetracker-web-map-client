import Box from '@mui/material/Box';
import { makeStyles } from 'models/makeStyles';
import dynamic from 'next/dynamic';
import React from 'react';

import Navbar from './Navbar';

const App = dynamic(() => import('./App'), { ssr: false });

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
  },
  left: {
    width: '50%',
    height: '100%',
    zIndex: 999,
    background: theme.palette.background.default,
    overflowY: 'auto',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  right: {
    width: '50%',
    zIndex: 998,
    background: 'gray',
    [theme.breakpoints.down('sm')]: {
      width: '0%',
    },
  },
}));

export default function Layout({ children }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Navbar />
      <Box className={classes.main}>
        <Box className={classes.left}>{children}</Box>
        <Box className={classes.right}>
          <App />
        </Box>
      </Box>
    </Box>
  );
}
