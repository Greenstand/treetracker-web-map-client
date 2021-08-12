import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  logo: {
    userSelect: "none",
    position: "absolute",
    right: 60,
    bottom: 20,
    opacity: 0,
    transform: "translate(0, 40px)",
    transition: "all 1s",
    "& img": {
      maxWidth: 250,
    },
    [theme.breakpoints.down("sm")]: {
      transform: "translate(0, -20px)",
      right: 10,
      top: 10,
      "& img": {
        width: "45vw",
      },
    },
  },
  logoLoaded: {
    transform: "translate(0, 0)",
    opacity: 1,
//    [theme.breakpoints.down("sm")]: {
//      transform: "translate(0, 0)",
//      opacity: 1,
//    },
  },
}));

function Logo(props){
  const classes = useStyles();
  return (
    <div className={`${classes.logo} ${props.logoLoaded?classes.logoLoaded:""}`}>
      <a href="https://greenstand.org/" target="_blank" rel="noopener noreferrer">
        <img alt="logo" src={props.logoSrc} />
      </a>
    </div>
  );
}

export default Logo
