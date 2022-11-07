import { Box, Typography } from '@mui/material';
import { useConfigContext } from 'context/configContext';
import CustomLogo from './CustomLogo';

function ChangeLogoSection() {
  const { state } = useConfigContext();

  return (
    <Box>
      <Typography>Change the Logo</Typography>
      <img src={state.navbar.logoUrl} height="300" />
      <CustomLogo />
    </Box>
  );
}

export default ChangeLogoSection;
