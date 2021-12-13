import CheckIcon from '@mui/icons-material/Check';
import { Chip } from '@mui/material';
import React from 'react';

function VerifiedBadge({ verified, badgeName }) {
  return (
    <Chip
      color="primary"
      sx={{
        bgcolor: verified ? 'primary.main' : 'textPrimary.main',
        color: 'common.white',
        borderRadius: 1,
        fontSize: 12,
      }}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      disabled={!verified}
    />
  );
}

export default VerifiedBadge;
