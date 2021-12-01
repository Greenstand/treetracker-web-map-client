import CalendarToday from '@mui/icons-material/CalendarToday';
import { Box } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()(() => ({
  container: {
    zIndex: 1,
    justifyContent: 'space-between',
  },

  entityName: {
    fontWeight: 500,
    color: '#bebcbc',
    fontSize: 15,
    textAlign: 'center',
    display: 'flex',
  },
  CalendarToday: {
    padding: '0px 5px',
    fontSize: 15,
    justifyContent: 'space-between',
  },
}));

function Time({ date }) {
  const { classes } = useStyles();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const created = ` ${monthName} ${date.getDate()}, ${date.getFullYear()}`;

  return (
    <Box className={classes.container}>
      <div>
        <div className={classes.entityName}>
          <CalendarToday className={classes.CalendarToday} />
          {created}
        </div>
      </div>
    </Box>
  );
}

export default Time;
