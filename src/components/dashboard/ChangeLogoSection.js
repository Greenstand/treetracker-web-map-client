import { Grid, Typography } from '@mui/material';
import { useConfigContext } from 'context/configContext';
import imagePlaceholder from 'images/image-placeholder.png';
import CustomLogo from './CustomLogo';

function ChangeLogoSection() {
  const { state } = useConfigContext();

  const onInvalidImage = (e) => {
    e.target.src = imagePlaceholder;
  };

  return (
    <Grid item xs={6}>
      <Typography>Change the Logo</Typography>
      <img src={state.navbar.logoUrl} height="300" onError={onInvalidImage} />
      <CustomLogo />
    </Grid>
  );
}

export default ChangeLogoSection;
