import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import Image from 'next/image';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  container: {
    background: theme.palette.background.OrangeGreenGradientDark,
    display: 'flex',
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: theme.spacing(6),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  media: {
    height: 110,
    width: 110,
    borderRadius: '50%',
    float: 'left',
  },
}));

function PlanterQuote({ quote, name, photo, initialDate, location }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Stack direction="row" width={1}>
        <Box sx={{ position: 'relative', width: '80%', height: '100%' }}>
          <Image
            layout="fill"
            objectFit="contain"
            src={photo}
            title={name}
            alt={`${name}'s Photo`}
          />
        </Box>

        <Stack spacing={10}>
          <Typography variant="body1" sx={{ color: 'textPrimary.main' }}>
            {quote}
          </Typography>

          <Stack spacing={1}>
            <Typography
              variant="h5"
              sx={{ color: 'textPrimary.main', fontFamily: 'h1.fontFamily' }}
            >
              {name}
            </Typography>

            <Typography
              sx={{ color: 'textLight.main' }}
            >{`Planter since ${initialDate}`}</Typography>

            <Stack direction="row" spacing={1}>
              <LocationOnOutlinedIcon
                fontSize="small"
                sx={{ color: 'textLight.main' }}
              />
              <Typography sx={{ color: 'textLight.main' }}>
                {location}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PlanterQuote;
