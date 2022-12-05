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
import log from 'loglevel';
import moment from 'moment';
import Image from 'next/image';
import { getLocationString } from 'models/utils';
import Link from './Link';
import ColorButton from './common/ColorButton';
import DataTag from './common/DataTag';
import Info from './common/Info';
import { useMobile } from '../hooks/globalHooks';
import CalendarIcon from '../images/icons/calendar.svg';
import LocationIcon from '../images/icons/location.svg';
import PeopleIcon from '../images/icons/people.svg';
import imagePlaceholder from '../images/image-placeholder.png';
import QuoteImgReverse from '../images/quote-reverse.svg';
import QuoteImg from '../images/quote-symbol.svg';
// TODO: something is wrong with quote-symbol.svg and quote-reverse.svg, they show a blank space. The svg files pull up as blanks. Not sure how to fix them, putting up an issue as this is something totally different than what I'm working on.

function PlanterQuote(props) {
  log.warn('props:', props);
  const { planter, reverse = false } = props;
  const {
    id,
    about: quote2,
    name,
    image_url: photo2,
    created_at,
    location,
  } = planter;

  let quote = quote2 || "the planter hasn't left any quote yet";
  if (quote.length > 500) {
    quote = `${quote.substring(0, 500)}...`;
  }
  const photo = photo2 || imagePlaceholder;

  const theme = useTheme();
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
              flex: 1,
            }}
          >
            <SvgIcon
              component={QuoteImg}
              inheritViewBox
              alt="quote"
              fontSize="large"
              sx={{
                position: 'absolute',
                top: [1, -19],
                left: [-22, -23],
                transform: ['scale(2.5)', 'scale(3.5)'],
              }}
            />
            <Typography
              variant="body1"
              sx={{
                minHeight: [45, 95],
                minWidth: [200, 410],
              }}
            >
              {quote}
            </Typography>
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
                info={`Planter since ${moment(planter.created_at).format(
                  'MMMM DD, YYYY',
                )}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(
                  planter.country_name,
                  planter.continent_name,
                )}
              />
            </Box>
          </Box>
        </Box>
      )}
      {reverse && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              flex: 1,
            }}
          >
            <SvgIcon
              component={QuoteImgReverse}
              inheritViewBox
              fontSize="large"
              alt="quote"
              sx={{
                position: 'absolute',
                top: [-7, -7],
                right: [-11, -11],
                transform: ['scale(2.5)', 'scale(3.5)'],
              }}
            />
            <Typography
              variant="body1"
              sx={{
                minHeight: [45, 95],
                minWidth: [150, 350],
              }}
            >
              {quote}
            </Typography>
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
                info={`Planter since ${moment(planter.created_at).format(
                  'MMMM DD, YYYY',
                )}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(
                  planter.country_name,
                  planter.continent_name,
                )}
              />
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
        <Link href={`/planters/${id}`}>
          <ColorButton>Meet the Planter</ColorButton>
        </Link>
      </Box>
    </Box>
  );
}

export default PlanterQuote;
