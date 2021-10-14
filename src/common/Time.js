import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import CalendarToday from '@material-ui/icons/CalendarToday';

 
const useStyles = makeStyles((theme) => ({


  container: {
    position: 'absolute',
    zIndex: 1,
    justifyContent:"space-between",
  

        
  },

  entityName: {
    fontWeight: 500,
    color: '#bebcbc',
    fontSize: 15,
    textAlign:"center",
    display:"flex",

    
  
    
  },
  CalendarToday: {
    padding: '0px 5px',
    fontSize: 15,  
    justifyContent:"space-between",

    
  
  },
}));

function Time({
  entityName,
}) {
  const classes = useStyles();
  return (
    <Box
      className={classes.container}
    >
      <div>
          <div className={classes.entityName}> <CalendarToday  className={classes.CalendarToday}/>{entityName}</div>
         
      </div>
 
    </Box>
  );
}

export default Time;







