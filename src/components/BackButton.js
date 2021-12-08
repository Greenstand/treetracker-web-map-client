import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ButtonBase, Typography } from '@mui/material';
import React from 'react';

const useStyles = makeStyles()(() => ({
  backButton: {
    textTransform: 'none',
    fontSize: 16,
    lineHeight: '16px',
    color: '#6B6E70',
  },
  icon: {
    marginRight: -4,
  },
}));

export default function BackButton({ onBackHandler }) {
  const { classes } = useStyles();
  return (
    <ButtonBase
      onClick={onBackHandler}
      className={classes.backButton}
      color="textPrimary"
    >
      <ArrowBackIosIcon fontSize="inherit" className={classes.icon} />
      Back
    </ButtonBase>
  );
}
