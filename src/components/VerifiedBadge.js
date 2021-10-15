import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  chip: {
    borderRadius: '4px',
  },
}));

function VerifiedBadge({ verified, badgeName }) {
  const classes = useStyles();
  return (
    <Chip
      className={classes.chip}
      color={!verified ? 'gray' : 'secondary'}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      disabled={!verified}
    />
  );
}

export default VerifiedBadge;
