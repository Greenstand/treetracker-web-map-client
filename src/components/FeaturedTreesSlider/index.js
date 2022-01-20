import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Grid } from '@mui/material';
import { useRef } from 'react';
import { useStyles } from './style'; // the style file
import Link from '../Link';

function FeaturedTreesSlider({ trees, size = null }) {
  // default size of images = 208px;
  // if size="small" props is passed in, size of images= 144px
  const { classes } = useStyles(size);
  const sliderRef = useRef();

  const scrollHandler = (num) => {
    sliderRef.current.scrollLeft += num;
  };

  return (
    <div className={classes.SliderContainer}>
      <Button className={classes.GoRight} onClick={() => scrollHandler(500)}>
        <ArrowForwardIosIcon />
      </Button>
      <Grid ref={sliderRef} className={classes.SliderImgContainer}>
        {trees.map((tree) => (
          <Link
            href={`/trees/${tree.id}`}
            key={tree.id}
            className={classes.Card}
          >
            <img className={classes.Img} src={tree.image_url} />
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
