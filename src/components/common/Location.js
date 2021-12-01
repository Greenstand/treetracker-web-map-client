import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React, { useState, useEffect } from 'react';

const useStyles = makeStyles()(() => ({
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
    padding: '0px 5px',
    fontSize: 15,
    justifyContent: 'space-between',
  },
}));

function Location({ coordinates }) {
  const { classes } = useStyles();

  const [location, setLocation] = useState(null);

  async function getLocation() {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/location/lat=${coordinates.latitude}long=${coordinates.longitude}`;
    const res = await fetch(url);
    setLocation(await res.json());
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Box className={classes.container}>
      <div>
        <div className={classes.entityLocation}>
          <LocationOnOutlinedIcon className={classes.LocationOnOutlinedIcon} />
          {location == null ? null : `${location.city}, ${location.country}`}
        </div>
      </div>
    </Box>
  );
}

export default Location;
