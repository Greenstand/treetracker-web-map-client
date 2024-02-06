import { Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useDashboardContext } from 'context/dashboardContext';
import CustomLogo from './CustomLogo';

function ChangeLogoSection() {
  const { state } = useDashboardContext();

  return (
    <Grid item xs={6}>
      <Typography>Change the Logo</Typography>
      <Image src={state.navbar.logoUrl} height="300" alt="Logo" />
      <CustomLogo />
    </Grid>
  );
}

export default ChangeLogoSection;
