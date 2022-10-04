import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

export default function SpinnerOverlay({ className = '', sx = {} }) {
  return (
    <Paper
      className={className}
      sx={{
        display: 'flex',
        position: 'absolute',
        background: 'rgba(255,255,255,.6)',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
    >
      <CircularProgress />
    </Paper>
  );
}
