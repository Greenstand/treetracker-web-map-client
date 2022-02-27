import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, Grid, Typography } from '@mui/material';
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
      <Button
        className={classes.arrow}
        onClick={() => scrollHandler(500)}
        sx={{
          right: 0,
          borderRadius: '40px 0 0 40px',
        }}
      >
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
            <Box className={classes.Title}>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Montserrat', letterSpacing: '0.04em' }}
              >
                {tree.species} - {tree.id}
              </Typography>
            </Box>
          </Link>
        ))}
      </Grid>
      <Button
        className={classes.arrow}
        onClick={() => scrollHandler(-500)}
        sx={{
          left: 0,
          borderRadius: ' 0 40px 40px 0',
        }}
      >
        <ArrowBackIosIcon />
      </Button>
    </div>
  );
}

export default FeaturedTreesSlider;
