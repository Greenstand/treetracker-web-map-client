import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import Image from 'next/image';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  container: {
    background: theme.palette.background.greenOrangeLightGrInverse,
    display: 'flex',
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: theme.spacing(6),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  contentWrapper: {
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    justifyContent: 'center',
  },
  button: {
    background: theme.palette.background.OrangeGreenGradient,
    height: 52,
    borderRadius: theme.spacing(6),
    boxShadow: '0px 8px 16px rgba(97, 137, 47, 0.25)',
    textTransform: 'none',
    fontSize: '1.25rem',
    letterSpacing: '0.02em',
    lineHeight: theme.spacing(6),
    marginTop: theme.spacing(5),
    color: theme.palette.textPrimary.main,
  },
  media: {
    height: 110,
    width: 110,
    borderRadius: '50%',
    float: 'left',
  },
  quote: {
    fontFamily: 'Lato',
    fontWeight: 400,
    letterSpacing: '0.02em',
    color: '#474B4F',
    width: 406,
    height: 66,
    marginTop: theme.spacing(2),
  },
  name: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    letterSpacing: '0.02em',
    color: '#474B4F',
    marginTop: theme.spacing(2),
  },
  infoText: {
    fontFamily: 'Lato',
    fontWeight: 400,
    color: '#6B6E70',
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
          <Typography className={classes.quote}>{quote}</Typography>

          <Stack spacing={1}>
            <Typography className={classes.name}>{name}</Typography>

            <Typography
              className={classes.infoText}
            >{`Planter since ${initialDate}`}</Typography>

            <Stack direction="row" spacing={1}>
              <LocationOnOutlinedIcon
                fontSize="small"
                sx={{ color: '#6B6E70' }}
              />
              <Typography className={classes.infoText}>{location}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PlanterQuote;
