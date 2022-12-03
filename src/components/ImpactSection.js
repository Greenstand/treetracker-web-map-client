import { Typography, Grid, Box } from '@mui/material';
import CustomCard from './common/CustomCard';
import Icon from './common/CustomIcon';
import CarbonIcon from '../img/icons/carbon.svg';
import DollarIcon from '../img/icons/dollar.svg';
import StaticGraph from '../img/static-graph.svg';

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
          gap: [2, 4],
        }}
      >
        <Grid item sx={{ flex: '1' }}>
          <CustomCard
            handleClick={() => {}}
            iconURI={DollarIcon}
            iconProps={{
              sx: {
                '& path': {
                  stroke: ({ palette }) => palette.text.disabled,
                  fill: ({ palette }) => palette.text.disabled,
                },
              },
            }}
            title="Current Value"
            text="---"
            disabled
          />
        </Grid>
        <Grid item sx={{ flex: '1' }}>
          <CustomCard
            handleClick={() => {}}
            iconURI={CarbonIcon}
            iconProps={{
              sx: {
                '& path': {
                  stroke: ({ palette }) => palette.text.disabled,
                  fill: 'none',
                },
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
        <Icon icon={StaticGraph} height={['100%', 487]} width="100%" />
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
