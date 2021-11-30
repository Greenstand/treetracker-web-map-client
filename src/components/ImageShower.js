import Close from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()(() => ({
  closeIcon: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 99999,
  },
  icon: {
    width: 80,
    height: 'auto',
  },
}));

function ImageShower(props) {
  const { classes } = useStyles();
  if (!props.open) {
    return null;
  }
  return (
    <>
      <Dialog open={true} onClose={props.onClose}>
        <img alt={props.title} src={props.src} />
      </Dialog>
      <IconButton className={classes.closeIcon} onClick={props.onClose}>
        <Close className={classes.icon} />
      </IconButton>
    </>
  );
}

export default ImageShower;
