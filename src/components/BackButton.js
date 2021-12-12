import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import React from 'react';

export default function BackButton({ onBackHandler }) {
  return (
    <ButtonBase onClick={onBackHandler} sx={{ color: 'textLight.main' }}>
      <ArrowBackIosIcon fontSize="inherit" />
      <Typography>Back</Typography>
    </ButtonBase>
  );
}
