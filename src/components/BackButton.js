import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

export default function BackButton({ onBackHandler }) {
  return (
    <ButtonBase onClick={onBackHandler}>
      <ArrowBackIosIcon fontSize="inherit" sx={{ color: 'text.disabled' }} />
      <Typography
        variant="body1"
        color="text.disabled"
        sx={{ lineHeight: '16px' }}
      >
        Back
      </Typography>
    </ButtonBase>
  );
}
