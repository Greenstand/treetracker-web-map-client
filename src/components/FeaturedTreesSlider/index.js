import { Button, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, { useRef, useState } from 'react';

import Link from '../Link';
import { useStyles } from './style.js'; // the style file

function FeaturedTreesSlider(props) {
  const classes = useStyles();
  const sliderRef = useRef();

  const { trees } = props;

  const scrollHandler = (num) => {
    sliderRef.current.scrollLeft += num;
  };

  return (
    <div className={classes.SliderContainer}>
      <Button className={classes.GoRight} onClick={() => scrollHandler(500)}>
        <ArrowForwardIosIcon />
      </Button>
      <Grid ref={sliderRef} className={classes.SliderImgContainer}>
        {trees.map((tree, index) => (
          <Link href={`/trees/${tree.id}`} key={index} className={classes.Card}>
            <img className={classes.Img} src={tree.photo_url} />
            <div className={classes.Title}>
              <p style={{ padding: '0 8px' }}>
                {tree.species} - {tree.id}
              </p>
            </div>
          </Link>
        ))}
      </Grid>
      <Button className={classes.GoLeft} onClick={() => scrollHandler(-500)}>
        <ArrowBackIosIcon />
      </Button>
    </div>
  );
}

export default FeaturedTreesSlider;
