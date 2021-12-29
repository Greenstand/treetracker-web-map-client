import { Box, Stack, Typography } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import Image from 'next/image';
import React from 'react';

import DataTag from './common/DataTag';

const quoteImg = '/images/quote-symbol.svg';

const useStyles = makeStyles()((theme) => ({
  container: {
    background: theme.palette.background.OrangeGreenGradientDark,
    display: 'flex',
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: theme.spacing(6),
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(13),
      paddingTop: theme.spacing(15),
      paddingBottom: theme.spacing(8),
      marginTop: theme.spacing(30),
      borderRadius: 8,
    },
    position: 'relative',
  },
  quoteContainer: {
    position: 'absolute',
    left: theme.spacing(50),
    top: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      top: theme.spacing(6),
      left: theme.spacing(5),
      width: 120,
    },
    zIndex: 0,
  },
  imageBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      height: 150,
      left: -5,
      top: -100,
    },
  },
}));

function PlanterQuote({ quote, name, photo, initialDate, location }) {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.quoteContainer}>
        <Image src={quoteImg} width={150} height={100} />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }}>
        <Box className={classes.imageBox}>
          <Image
            layout="fill"
            objectFit="contain"
            src={photo}
            title={name}
            alt={`${name}'s Photo`}
          />
        </Box>

        <Stack spacing={{ xs: 12, sm: 10 }}>
          <Typography
            variant="body1"
            sx={{ color: 'textPrimary.main', zIndex: 'tooltip', fontSize: 16 }}
          >
            {quote}
          </Typography>

          <Stack spacing={3}>
            <Typography
              variant="h5"
              sx={{ color: 'textPrimary.main', fontFamily: 'h1.fontFamily' }}
            >
              {name}
            </Typography>
            <Stack spacing={1}>
              <DataTag data={initialDate} />
              <DataTag data={location} location />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PlanterQuote;
