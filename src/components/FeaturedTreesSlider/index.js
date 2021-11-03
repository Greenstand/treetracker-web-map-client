import { Button, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, { useRef, useState } from 'react';

import Link from '../Link';
import { useStyles } from './style.js'; // the style file

function FeaturedTreesSlider() {
  const classes = useStyles();
  const sliderRef = useRef();

  // fake data
  const trees = [
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/10/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/1037/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/106/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/107/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/108/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/109/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/111/208',
      species: 'Palm Tree',
    },
    {
      id: '115059',
      photo_url: 'https://picsum.photos/id/112/208',
      species: 'Palm Tree',
    },
  ];

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
