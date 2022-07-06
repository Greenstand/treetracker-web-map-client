import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { getTreeSpecies } from 'models/trees';
import { debounce } from 'models/utils';
import { useStyles } from './style'; // the style file
import { getThumbnailImageUrls } from '../../models/utils';
import Link from '../Link';

const SLIDE_EXTREME_INDEX = 30;

function FeaturedTreesSlider({ trees, size = null, isMobile }) {
  // default size of images = 208px;
  // if size="small" props is passed in, size of images= 144px
  const { classes } = useStyles(size);
  const sliderRef = useRef();

  const [leftScrollButton, showLeftScrollButton] = useState();
  const [rightScrollButton, showRightScrollButton] = useState();

  const onScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    // checking if user reached extreme left or right scroll postions
    // then disable respective button
    showLeftScrollButton(!(scrollLeft < SLIDE_EXTREME_INDEX));
    showRightScrollButton(
      !(Math.abs(scrollWidth - clientWidth - scrollLeft) < SLIDE_EXTREME_INDEX),
    );
  };

  useEffect(() => {
    onScroll();
  });

  const scrollHandler = (num) => {
    sliderRef.current.scrollLeft += num;
  };

  return (
    <div className={classes.SliderContainer}>
      {!isMobile && leftScrollButton && (
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
      )}
      <Grid
        ref={sliderRef}
        className={classes.SliderImgContainer}
        onScroll={debounce(onScroll, 70)}
      >
        {trees.map((tree) => (
          <Card
            key={tree.id}
            elevation={8}
            sx={{
              transition: 'all .5s',
              scrollSnapAlign: 'center',
              scrollBehavior: 'smooth',
              // position: 'relative',
              padding: (theme) => theme.spacing(5),
              borderRadius: (theme) => theme.spacing(4),
              // boxShadow: '0px 2px 16px rgba(34, 38, 41, 0.15)',
              // width: [152, 208],
              overflow: 'initial',
            }}
          >
            <CardMedia
              component="img"
              image={getThumbnailImageUrls(tree.image_url, 208, 232)}
              alt="tree"
              sx={{
                borderRadius: '16px',
                transition: 'transform .5s',
                width: 208,
                height: 232,
                minWidth: [144, 208],
              }}
            />
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '20px',
                  marginTop: 4,
                }}
              >
                <Link href={`/trees/${tree.id}`}>Tree - {tree.id}</Link>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: 1.5,
                }}
              >
                {getTreeSpecies(tree)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
      {!isMobile && rightScrollButton && (
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
      )}
    </div>
  );
}

export default FeaturedTreesSlider;
