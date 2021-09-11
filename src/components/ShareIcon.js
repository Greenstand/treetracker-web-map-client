import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Code from "@material-ui/icons/Code";
import Email from "@material-ui/icons/Email";

const useStyles = makeStyles(theme => ({
  gridContainer:{
    padding: theme.spacing(2),
  },
}));

function ShareIcon (props) {
  const classes = useStyles();

  return (
    <Grid item className={classes.gridContainer} >
      <Grid container direction="column" alignItems="center" >
        <Grid item>
          <IconButton onClick={props.clickHandler}>
            {(() => {
              switch(props.iconSrc) {
                case "Embed":
                  return <Avatar>
                    <Code/>
                  </Avatar>
                case "Email":
                  return <Avatar>
                    <Email/>
                  </Avatar>
                default:
                  return <Avatar src={props.iconSrc}/>
              }
            })()}
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="button" >
            {props.name}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ShareIcon
