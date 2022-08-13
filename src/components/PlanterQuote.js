import {
  Avatar,
  Button,
  Box,
  Grid,
  Typography,
  useTheme,
  SvgIcon,
} from '@mui/material';
import * as d3 from 'd3';
import moment from 'moment';
import Image from 'next/image';
import ColorButton from './common/ColorButton';
import DataTag from './common/DataTag';
import Info from './common/Info';
import { useMobile } from '../hooks/globalHooks';
import CalendarIcon from '../images/icons/calendar.svg';
import LocationIcon from '../images/icons/location.svg';
import PeopleIcon from '../images/icons/people.svg';
import QuoteImgReverse from '../images/quote-reverse.svg';
import QuoteImg from '../images/quote-symbol.svg';

// TODO: something is wrong with quote-symbol.svg and quote-reverse.svg, they show a blank space. The svg files pull up as blanks. Not sure how to fix them, putting up an issue as this is something totally different than what I'm working on.

function PlanterQuote({
  quote,
  name,
  photo,
  initialDate,
  location,
  reverse = false,
}) {
  const isMobile = useMobile();
  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: 1,
        px: [48 / 8, 48 / 4],
        pt: [78 / 8, 78 / 4],
        pb: [6, 12],
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
      {!reverse && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={photo}
            sx={{
              zIndex: '1',
              width: [90, 180],
              height: [90, 180],
              filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.25))',
            }}
          />
          <Box
            sx={{
              ml: [4, 6],
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -42,
                left: -80,
                transform: ['scale(.5)', ''],
              }}
            >
              <SvgIcon
                component={QuoteImg}
                inheritViewBox
                alt="quote"
                fontSize="large"
              />
            </Box>
            <Typography variant="body1">{quote}</Typography>
            <Typography
              sx={{
                mt: [4, 8],
              }}
              variant="h5"
            >
              {name}
            </Typography>
            <Box sx={{ mt: [1.5, 3] }}>
              <Info
                iconURI={CalendarIcon}
                info={`Planter since ${moment().format('MMMM DD, YYYY')}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info iconURI={LocationIcon} info="Shirimatunda, Tanzania" />
            </Box>
          </Box>
        </Box>
      )}
      {reverse && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -42,
                right: -103,
                transform: ['scale(.5)', ''],
              }}
            >
              <SvgIcon
                component={QuoteImgReverse}
                inheritViewBox
                fontSize="large"
                alt="quote"
              />
            </Box>
            <Typography variant="body1">&ldquo;{quote}&ldquo;</Typography>
            <Typography
              sx={{
                mt: [4, 8],
              }}
              variant="h5"
            >
              {name}
            </Typography>
            <Box sx={{ mt: [1.5, 3] }}>
              <Info
                iconURI={CalendarIcon}
                info={`Planter since ${moment().format('MMMM DD, YYYY')}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info iconURI={LocationIcon} info="Shirimatunda, Tanzania" />
            </Box>
          </Box>
          <Avatar
            src={photo}
            sx={{
              ml: [26 / 8, 26 / 4],
              zIndex: '1',
              width: [90, 180],
              height: [90, 180],
              filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.25))',
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          mt: [8, 16],
        }}
      >
        <ColorButton>Meet the Planter</ColorButton>
      </Box>
    </Box>
  );
}

export default PlanterQuote;
