import { Box, Button, CardMedia, Typography } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';
import Link from './Link';

const useStyles = makeStyles()((theme) => ({
  container: {
    boxSizing: 'border-box',
    height: 220,
    padding: '25px 30px',
    background: theme.palette.background.greenOrangeLightGr,
    borderRadius: '15px',
  },
  contentWrapper: {
    gap: '9px',
    paddingLeft: theme.spacing(2),
  },
  button: {
    height: 45,
    borderRadius: '25px',
    background: theme.palette.background.OrangeGreenGradient,
    boxShadow: '0px 8px 16px rgba(97, 137, 47, 0.25)',
    textTransform: 'none',
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
    fontSize: 18,
  },
  entityType: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
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
