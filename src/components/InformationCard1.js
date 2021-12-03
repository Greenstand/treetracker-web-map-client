import { Box, Button, CardMedia } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import Link from './Link';

const useStyles = makeStyles()((theme) => ({
  container: {
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: theme.spacing(6),
    background:
      'linear-gradient(120.41deg, rgba(255, 122, 0, 0.15) 25.62%, rgba(117, 185, 38, 0.4) 97.96%)',
    borderRadius: theme.spacing(4),
  },
  contentWrapper: {
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    justifyContent: 'center',
  },
  button: {
    height: 52,
    borderRadius: '26px',
    background:
      'linear-gradient(90.06deg, rgba(255, 165, 0, 0.45) 0.79%, rgba(117, 185, 38, 0.45) 49.97%, rgba(96, 137, 47, 0.6) 99.95%)',
    boxShadow: '0px 8px 16px rgba(97, 137, 47, 0.25)',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '1.25rem',
    letterSpacing: '2%',
    lineHeight: theme.spacing(6),
    marginTop: theme.spacing(5),
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
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
}

export default InformationCard1;
