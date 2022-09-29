import { Typography, Grid, Box, SvgIcon } from '@mui/material';
import { useState } from 'react';
import CustomCard from './common/CustomCard';
import CarbonIcon from '../images/icons/carbon.svg';
import DollarIcon from '../images/icons/dollar.svg';
import StaticGraph from '../images/static-graph.svg';

function ImpactSection() {
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
        <Grid item sx={{ width: '49%', display: 'flex' }}>
          <CustomCard
            handleClick={() => {}}
            iconURI={DollarIcon}
            sx={{
              width: [24, 32],
              height: [24, 32],
              '& path': {
                stroke: ({ palette }) => palette.text.disabled,
                fill: ({ palette }) => palette.text.disabled,
              },
              flex: '1',
            }}
            title="Current Value"
            text="---"
            disabled
          />
        </Grid>
        <Grid item sx={{ width: '49%' }}>
          <CustomCard
            handleClick={() => {}}
            iconURI={CarbonIcon}
            sx={{
              width: [24, 32],
              height: [24, 32],
              '& path': {
                stroke: ({ palette }) => palette.text.disabled,
              },
            }}
            title="Carbon Capture"
            text="---"
            disabled
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          position: 'relative',
          mt: 14,
          mb: 6,
        }}
      >
        <SvgIcon
          component={StaticGraph}
          inheritViewBox
          height="100%"
          sx={{
            height: ['100%', 487],
            width: '100%',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          variant="h5"
        >
          Graphical Data Coming Soon!
        </Typography>
      </Box>
    </>
  );
}

export default ImpactSection;
