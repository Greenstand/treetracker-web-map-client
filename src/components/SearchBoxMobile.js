import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  InputBase,
  TextField,
} from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

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
  behind: {},
  above: {},
  inputBase: {
    border: '1px solid gray',
    height: '10vh',
    borderRadius: '5vh',
    padding: theme.spacing(2),
  },
}));

export default function SearchBox() {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <InputBase
        className={classes.inputBase}
        type="search"
        placeholder="Enter a tree ID, tree species, or location"
        variant="outlined"
        endAdornment={
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        }
      />
    </Box>
  );
}
