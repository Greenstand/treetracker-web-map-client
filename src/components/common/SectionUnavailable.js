import { Alert } from '@mui/material';

/*
  inline notice for a page section whose data failed to load, so missing
  data isn't presented as empty
*/
export default function SectionUnavailable({ children, sx }) {
  return (
    <Alert severity="info" variant="outlined" sx={{ mt: 4, ...sx }}>
      {children}
    </Alert>
  );
}
