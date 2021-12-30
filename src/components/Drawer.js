import ExpandLess from '@mui/icons-material/ExpandLess';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import React from 'react';

const style = (theme) => ({
  map: {
    width: '100vw',
    height: '100vh',
  },
  paper: {
    background: 'transparent',
    overflow: 'visible',
  },
  rounded: {
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  drawer: {
    height: '80vh',
    width: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  box: {
    justifyContent: 'center',
  },
  bottomPaper: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    boxShadow: '0 -1px 2px rgb(0 0 0 / 30%)',
    zIndex: 1000,
    borderRadius: '8px 8px 0 0 ',
  },
  bottomBox: {
    height: theme.spacing(6),
  },
  bottomArrow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  bottomContent: {
    flexGrow: 1,
  },
  bottomItem: {
    marginLeft: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  box1: {
    height: '100%',
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    backgroundColor: '#DADCE0',
    borderRadius: 50,
    height: 4,
    margin: '0 auto',
    width: 24,
    marginTop: 10,
  },
});

function Drawer(props) {
  const { classes, children } = props;
  const [open, setOpen] = React.useState(true);

  // console.log("Tokens List", tokens)

  function handleClickBottom() {
    setOpen(true);
  }

  return (
    <>
      <SwipeableDrawer
        anchor={'bottom'}
        open={open}
        classes={{ paper: classes.paper }}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen={true}
        BackdropProps={{ open: false }}
        style={{ position: 'relative' }}
      >
        <Box
          sx={{
            /* height: (t) => `calc(100vh - ${t.spacing(18)})`, */
            height: '60vh',
            backgroundColor: 'white',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </SwipeableDrawer>
      {!open && (
        <Paper
          sx={{ pointerEvents: 'auto' }}
          className={classes.bottomPaper}
          onClick={handleClickBottom}
        >
          <Grid container className={classes.bottomBox} wrap="nowrap" pt={1}>
            <Grid item className={classes.bottomArrow}>
              <ExpandLess color="action" />
            </Grid>
            <Grid item className={classes.bottomContent}>
              <Grid container className={classes.box1}>
                <Grid item className={classes.bottomItem}>
                  <Avatar className={classes.avatar} />
                </Grid>
                <Grid item className={classes.bottomItem}>
                  <Typography variant="h6">@$</Typography>
                </Grid>
                <Grid item className={classes.bottomItem}>
                  <Typography variant="body1">tokens</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
}

export default withStyles(style)(Drawer);
