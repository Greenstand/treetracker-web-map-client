import Navbar from "./Navbar";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
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
    zIndex: 999
  },
  right: {
    width: "50%",
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} >
      <Grid item className={classes.nav} >
        <Paper>
          <Navbar/>
        </Paper>
      </Grid>
      <Grid item className={classes.mainItem} >
        <Grid container className={classes.main} >
        <Grid item className={classes.left} >
           {children}
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
