import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Chip } from '@mui/material';

function VerifiedBadge({ verified, badgeName }) {
  return (
    <Chip
      sx={{ borderRadius: 2 }}
      color={verified ? 'secondary' : 'default'}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      disabled={!verified}
    />
  );
}

export default VerifiedBadge;
