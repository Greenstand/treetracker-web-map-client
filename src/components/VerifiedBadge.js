import CheckIcon from '@mui/icons-material/Check';
import { Chip } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()(() => ({
  chip: {
    borderRadius: '4px',
  },
}));

function VerifiedBadge({ verified, badgeName }) {
  const classes = useStyles();
  return (
    <Chip
      className={classes.chip}
      color={!verified ? 'primary' : 'secondary'}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      disabled={!verified}
    />
  );
}

export default VerifiedBadge;
