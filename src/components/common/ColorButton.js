import { Button, Typography } from '@mui/material';

export default function ColorButton({ children }) {
  return (
    <Button
      sx={{
        height: [40, 52],
        background: (t) => t.palette.background.OrangeGreenGradient,
        borderRadius: 6,
        boxShadow: '0px 8px 16px rgba(97, 137, 47, 0.25)',
        textTransform: 'none',
        color: (t) => t.palette.text.text1,
      }}
      fullWidth
    >
      <Typography
        variant="body2"
        sx={{
          color: 'nearBlack.main',
          fontWeight: 700,
        }}
      >
        {children}
      </Typography>
    </Button>
  );
}
