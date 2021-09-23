import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import backgroundImage from "./images/bg.png";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Navbar from "./components/Navbar";
import log from "loglevel";
import dynamic from "next/dynamic";

const App = dynamic(() => import('./App'), { ssr: false });

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
  },
  nav: {
    height: theme.spacing(18),
    width: "100%",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  mainItem: {
    height: "100%",
  },
  main: {
    width: "100vw",
    height: "100%",
  },
  left: {
    width: "50%",
    height: "100%",
    overflow: "hidden",
    background: `center / cover no-repeat url(${backgroundImage})`,
    display: "flex",
    alignItems: "center",
  },
  leftContainer: {
    color: "white",
    width: "75%",
    margin: "0 auto",
  },
  right: {
    width: "50%",
  },
  welcome: {
    fontFamily: "Montserrat !important",
    fontSize: "20px !important",
    fontStyle: "normal !important",
    fontWeight: "700 !important",
    lineHeight: "26px !important",
    letterSpacing: "0em !important",
    textAlign: "left !important",
  },
  slogan: {
    fontFamily: "Montserrat !important",
    fontSize: "40px !important",
    fontStyle: "normal !important",
    fontWeight: "700 !important",
    lineHeight: "63px !important",
    letterSpacing: "0em !important",
    textAlign: "left !important",
  },
  button: {
    background: "#86C232",
  },
}));

function Home(){
  const classes = useStyles();
  return(
    <Grid container className={classes.root} >
      <Grid item className={classes.nav} >
        <Paper>
          <Navbar/>
        </Paper>
      </Grid>
      <Grid item className={classes.mainItem} >
        <Grid container className={classes.main} >
          <Grid item className={classes.left} >
            <Grid container className={classes.leftContainer} >
              <Typography variant="h4" className={classes.welcome} >
                Welcome to TreeTracker
              </Typography>
              <Typography variant="h2" className={classes.slogan} >
                Come explore the global reforestation effort.
              </Typography>
              <Grid container>
                <Button variant="outlined" color="primary" >
                  Learn more
                </Button>
                <Box sx={{width: 20}} component="span" />
                <Button variant="contained" className={classes.button} >
                  Let&apos;s Find a Tree
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.right} >
            <div>
              <App/>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Home;
