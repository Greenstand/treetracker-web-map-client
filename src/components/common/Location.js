import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  container: {
    zIndex: 1,
    justifyContent: 'space-between',
  },

  entityLocation: {
    fontWeight: 500,
    color: '#bebcbc',
    fontSize: 15,
    textAlign: 'center',
    display: 'flex',
  },
  LocationOnOutlinedIcon: {
    marginRight: theme.spacing(1),
    fontSize: 15,
    justifyContent: 'space-between',
  },
}));

function Location({ entityLocation }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.container} mt={2} mb={2}>
      <div>
        <div className={classes.entityLocation}>
          {' '}
          <LocationOnOutlinedIcon className={classes.LocationOnOutlinedIcon} />
          {entityLocation}
        </div>
      </div>
    </Box>
  );
}

export default Location;
