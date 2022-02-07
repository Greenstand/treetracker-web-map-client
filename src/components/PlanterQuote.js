import { Box, Grid, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import DataTag from './common/DataTag';
import quoteImgReverse from '../images/quote-reverse.svg';
import quoteImg from '../images/quote-symbol.svg';

function PlanterQuote({
  quote,
  name,
  photo,
  initialDate,
  location,
  reverse = false,
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.background.OrangeGreenGradientDark,
        backgroundColor: 'common.white',
        boxSizing: 'border-box',
        height: 'fit-content',
        justifyContent: 'center',
        padding: 8,
        borderRadius: { xs: 2, sm: 0 },
        px: { xs: 12 },
        py: { sm: 10 },
        mt: { xs: 30, sm: 0 },
      }}
    >
      <Grid
        container
        direction={{ xs: 'column', sm: reverse ? 'row-reverse' : 'row' }}
        spacing={2}
        alignItems="center"
      >
        <Grid item sm={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: { xs: 150, sm: 'fit-content' },
              mt: { xs: -30, sm: 0 },
              mb: { xs: 5, sm: 0 },
            }}
          >
            <Image
              width={200}
              height={250}
              objectFit="contain"
              src={photo}
              title={name}
              alt={`${name}'s Photo`}
            />
          </Box>
        </Grid>

        <Grid item sm={8} container direction="column" spacing={10}>
          <Grid
            item
            sx={{
              backgroundImage: reverse
                ? `url(${quoteImgReverse})`
                : `url(${quoteImg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: { xs: 100, sm: 130 },
              backgroundPosition: {
                xs: '1em 1.5em',
                sm: reverse ? 'right 1.5em' : 'left 1em',
              },
              pb: 5,
            }}
          >
            <Typography variant="body1" sx={{ color: 'textPrimary.main' }}>
              {`"${quote}"`}
            </Typography>
          </Grid>

          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h5" color="textSecondary.main">
                {name}
              </Typography>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <DataTag data={initialDate} color />
              </Grid>
              <Grid item>
                <DataTag data={location} location color />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PlanterQuote;
