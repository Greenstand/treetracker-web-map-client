import { Grid, Typography } from '@mui/material';
import imagePlaceholder from 'images/image-placeholder.png';
import { useDashboardContext } from 'context/dashboardContext';
import CustomLogo from './CustomLogo';

function ChangeLogoSection() {
  const { state } = useDashboardContext();

  const onInvalidImage = (e) => {
    e.target.src = imagePlaceholder;
  };

  return (
    <Grid item xs={6}>
      <Typography>Change the Logo</Typography>
      <img src={state.navbar.logoUrl} height="300" alt="Logo"  onError={onInvalidImage} />
      <CustomLogo />
    </Grid>
  );
}

export default ChangeLogoSection;
