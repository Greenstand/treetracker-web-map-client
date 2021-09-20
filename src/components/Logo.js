import {makeStyles} from "@material-ui/core/styles";
import React from "react";

import logo from "../images/greenstand_logo_full.png";

const useStyles = makeStyles(() => ({
  logo: {
    userSelect: "none",
    "& img": {
      maxWidth: 149,
    },
  },
}));

function Logo(){
  const classes = useStyles();
  return (
    <div className={`${classes.logo}`}>
      <a href="https://greenstand.org/" target="_blank" rel="noopener noreferrer">
        <img alt="logo" src={logo} />
      </a>
    </div>
  );
}

export default Logo
