import { Grid, Typography } from '@mui/material';
import CustomizeNavbar from './CustomizeNavbar';

function ChangeNavSection() {
  return (
    <Grid item xs={6}>
      <Typography>Change Navbar</Typography>
      <CustomizeNavbar />
    </Grid>
  );
}

export default ChangeNavSection;
