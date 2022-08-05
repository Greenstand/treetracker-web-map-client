import { Typography, Grid, Box } from '@mui/material';
import { useState } from 'react';
import CustomCard from './common/CustomCard';
import treeIcon from '../images/icons/tree.svg';

function ImpactSection() {
  const [isPlanterTab, setIsPlanterTab] = useState(true);

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontSize: [24, 28],
          lineHeight: (t) => [t.spacing(7.25), t.spacing(8.5)],
          mt: (t) => [t.spacing(14), t.spacing(20)],
        }}
      >
        Impact
      </Typography>
      <Grid
        container
        wrap="nowrap"
        justifyContent="space-between"
        sx={{
          width: 1,
          mt: [6, 9],
        }}
      >
        <Grid item sx={{ width: '49%' }}>
          <CustomCard
            handleClick={() => setIsPlanterTab(true)}
            iconURI={treeIcon}
            title="Current Value"
            text="---"
            disabled={!isPlanterTab}
          />
        </Grid>
        <Grid item sx={{ width: '49%' }}>
          <CustomCard
            handleClick={() => setIsPlanterTab(false)}
            iconURI={treeIcon}
            title="Carbon Capture"
            text="---"
            disabled={isPlanterTab}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          height: '600px',
          mt: 14,
          mb: 6,
          borderRadius: 4,
          backgroundColor: (t) => t.palette.greyLight.main,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: (t) => t.palette.greyLight.contrastText,
          }}
        >
          Graphical Data Coming Soon!
        </Typography>
      </Box>
    </>
  );
}

export default ImpactSection;
