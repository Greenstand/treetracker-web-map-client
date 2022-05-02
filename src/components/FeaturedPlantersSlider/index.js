import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import * as d3 from 'd3';
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
        onClick={() => scrollHandler(-500)}
        sx={{
          left: 0,
          // borderRadius: '40px 0 0 40px',
          position: 'absolute',
          borderRadius: ' 0 40px 40px 0',
          zIndex: 3,
          bottom: '47%',
          minWidth: '35px',
          height: '75px',
          cursor: 'pointer',
          marginLeft: -3,
          '& svg': {
            marginRight: -4,
          },
          opacity: 0.4,
        }}
        variant="contained"
      >
        <ArrowBackIosIcon
          sx={{
            transform: 'rotate(0deg)',
          }}
        />
      </Button>
      <Grid ref={sliderRef} className={classes.SliderImgContainer}>
        {planters.map((planter) => (
          <Card
            key={planter.id}
            elevation={8}
            sx={{
              transition: 'all .5s',
              scrollSnapAlign: 'center',
              scrollBehavior: 'smooth',
              // position: 'relative',
              padding: (theme) => theme.spacing(5),
              borderRadius: (theme) => theme.spacing(4),
              overflow: 'initial',
              bgcolor: (t) =>
                t.palette.mode === 'light'
                  ? d3
                      .color(t.palette.secondary.main)
                      .copy({ opacity: 0.2 })
                      .formatRgb()
                  : d3
                      .color(t.palette.secondary.main)
                      .copy({ opacity: 0.4 })
                      .formatRgb(),
            }}
          >
            <CardMedia
              component="img"
              image="https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg"
              alt="tree"
              sx={{
                width: 136,
                height: 136,
                borderWidth: 4,
                borderStyle: 'solid',
                borderColor: (t) => t.palette.background.paper,
                boxSizing: 'border-box',
                borderRadius: '50%',
                transition: 'transform .5s',
              }}
            />
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginTop: 4,
                  wordBreak: 'break-all',
                }}
                align="center"
              >
                <Link href={`/planters/${planter.id}`}>
                  {planter.first_name}
                  &nbsp;
                  {(planter.last_name && planter.last_name.slice(0, 1)) || ''}
                </Link>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
      <Button
        onClick={() => scrollHandler(500)}
        sx={{
          right: 0,
          position: 'absolute',
          borderRadius: '40px 0 0 40px',
          zIndex: 3,
          bottom: '47%',
          minWidth: '35px',
          height: '75px',
          cursor: 'pointer',
          marginRight: -3,
          '& svg': {
            marginLeft: -4,
          },
          opacity: 0.4,
        }}
        variant="contained"
      >
        <ArrowBackIosIcon
          sx={{
            transform: 'rotate(180deg)',
          }}
        />
      </Button>
    </div>
  );
}

export default FeaturedPlantersSlider;
