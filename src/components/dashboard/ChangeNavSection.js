import { Grid, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const CustomizeNavbar = dynamic(() => import('./CustomizeNavbar'), {
  ssr: false,
});

function ChangeNavSection() {
  return (
    <Grid item xs={6}>
      <Typography>Change Navbar</Typography>
      <CustomizeNavbar />
    </Grid>
  );
}

export default ChangeNavSection;
