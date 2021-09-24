import {makeStyles} from "@material-ui/core/styles";
import React from "react";

import greenstandLogo from "../images/greenstand_logo_full.png"

const logoWidth = 150;
const logoWidthSm = 100;

const useStyles = makeStyles(theme => ({
  logo: {
    userSelect: "none",
    position: "absolute",
    right: 60,
    bottom: 22,
    opacity: 0,
    padding: 10,
    width: logoWidth,
    "background-color": "white",
    transform: "translate(0, 40px)",
    transition: "all 1s",
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Roboto, Arial, sans-serif",
    borderRadius: 25,
    "& img": {
      width: logoWidth - 70,
    },
    "& #custom-logo": {
      width: logoWidth,
    },
    [theme.breakpoints.down("sm")]: {
      width: logoWidthSm,
      pointerEvents: "none",
      transform: "translate(0, -20px)",
      right: 10,
      top: 10,
      fontSize: 8,
      bottom: "auto",
      "& img": {
        width: logoWidthSm - 50,
      },
      "& #custom-logo": {
        width: logoWidthSm,
      },
    },
  },
  logoLoaded: {
    transform: "translate(0, 0)",
    opacity: 0.87,
  },
}));

function Logo(props){
  const classes = useStyles();

  return (
    <div className={`${classes.logo} ${props.logoLoaded?classes.logoLoaded:""}`}>
      {props.logoSrc &&
        <div>
          <img id="custom-logo" src={props.logoSrc}/>
          <br/>
        </div>
      }
      <span>
        Powered by{" "}
        <a href="https://greenstand.org/" target="_blank" rel="noopener noreferrer">
          <img alt="logo" src={greenstandLogo} />
        </a>
      </span>
    </div>
  );
}

export default Logo
