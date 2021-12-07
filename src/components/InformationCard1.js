import { Box, Button, CardMedia, Typography } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import Link from './Link';

const useStyles = makeStyles()((theme) => ({
  container: {
    boxSizing: 'border-box',
    background: theme.palette.background.greenOrangeLightGr,
    height: 'fit-content',
    padding: theme.spacing(6),
    borderRadius: theme.spacing(4),
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
  entityName: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: '1.75rem',
    color: theme.palette.textPrimary.main,
  },
  entityType: {
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    color: theme.palette.textPrimary.main,
  },
}));

function InformationCard1({
  entityName,
  entityType,
  buttonText,
  cardImageSrc,
  link,
}) {
  const { classes } = useStyles();
  return (
    <Box
      className={classes.container}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <div>
        <CardMedia
          className={classes.media}
          image={cardImageSrc}
          title="Contemplative Reptile"
          src={classes.media}
        />
        <Box
          className={classes.contentWrapper}
          height={110}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <div className={classes.entityType}>{entityType}</div>
          <div className={classes.entityName}>{entityName}</div>
        </Box>
      </div>
      <Link href={link}>
        <Button className={classes.button} fullWidth={true}>
          <Typography variant="h5">{buttonText}</Typography>
        </Button>
      </Link>
    </Box>
  );
}

export default InformationCard1;
