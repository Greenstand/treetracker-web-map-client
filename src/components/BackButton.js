import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export default function BackButton({ onBackHandler }) {
  return (
    <ButtonBase onClick={onBackHandler} sx={{ color: 'textLight.main' }}>
      <ArrowBackIosIcon fontSize="inherit" />
      <Typography variant="body1" sx={{ lineHeight: '16px' }}>
        Back
      </Typography>
    </ButtonBase>
  );
}
