import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ButtonBase, Typography } from '@mui/material';
import React from 'react';

export default function BackButton() {
  return (
    <ButtonBase sx={{ color: 'textLight.main' }}>
      <ArrowBackIosIcon fontSize="inherit" />
      <Typography variant="body1">Back</Typography>
    </ButtonBase>
  );
}
