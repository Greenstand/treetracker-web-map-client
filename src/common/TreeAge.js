import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AccessTime from '@material-ui/icons/AccessTime';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    color: '#fff',
    background: '#61892F',
    borderRadius: '16px',
    width: '169px',
    height: '99px',
  },
  clock: {
    position: 'static',
    width: '40px',
    height: '40px',
    left: '24px',
    top: '34.5px',
    flex: 'none',
    order: '0',
    flexGrow: '0',
    marginRight: '24px',
  },
  ageLabel: {
    position: 'static',
    left: '0px',
    top: '0px',
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.04em',
    color: '#FFFFFF',
    flex: 'none',
    order: '0',
    flexGrow: '0',
    margin: '8px 0px',
  },
  ageValue: {
    position: 'static',
    left: '0px',
    top: '27px',
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '20px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.04em',
    color: '#FFFFFF',
    flex: 'none',
    order: '1',
    flexGrow: '0',
    margin: '8px 0px',
  },
}));

function TreeAge({ treeAge }) {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <AccessTime className={classes.clock} />
      <Box>
        <p className={classes.ageLabel}>Age</p>
        <p className={classes.ageValue}>{treeAge}</p>
      </Box>
    </Box>
  );
}

export default TreeAge;
