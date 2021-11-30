import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()(() => ({
  fab: {
    height: 48,
    width: 48,
  },
  icon: {
    color: '#6B6E70',
  },
}));

export default function SearchButton() {
  const { classes } = useStyles();
  return (
    <Fab aria-label="search" color="primary" className={classes.fab}>
      <SearchIcon fontSize="large" className={classes.icon} />
    </Fab>
  );
}
