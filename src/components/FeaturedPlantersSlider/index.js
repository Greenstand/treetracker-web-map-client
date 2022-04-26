import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { useRef } from 'react';
import { useStyles } from './style'; // the style file
import Link from '../Link';

function FeaturedPlantersSlider({ planters, size = null }) {
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
        {planters.map((planter) => (
          <Link
            href={`/planters/${planter.id}`}
            key={planter.id}
            className={classes.Card}
            sx={{
              backgroundColor: '#FF7A0033',
              boxShadow: '0px 2px 16px rgba(255, 122, 0, 0.15)',
              borderRadius: '16px',
              textDecoration: 'none',
            }}
          >
            <Avatar
              sx={{
                width: 136,
                height: 136,
                border: '4px solid white',
                boxSizing: 'border-box',
              }}
              src="https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg"
            />
            <Box sx={{}}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '24px',
                  marginBottom: '20px',
                  textTransform: 'capitalize',
                }}
              >
                {planter.first_name}
                &nbsp;
                {(planter.last_name && planter.last_name.slice(0, 1)) || ''}
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

export default FeaturedPlantersSlider;
