import { Grid, Typography } from '@mui/material';
import { useConfigContext } from 'context/configContext';
import CustomLogo from './CustomLogo';

function ChangeLogoSection() {
  const { state } = useConfigContext();

  return (
    <Grid item xs={6}>
      <Typography>Change the Logo</Typography>
      <img src={state.navbar.logoUrl} height="300" alt="Logo" />
      <CustomLogo />
    </Grid>
  );
}

export default ChangeLogoSection;
