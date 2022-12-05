import { Card, Box, Button, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as d3 from 'd3';
import log from 'loglevel';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';
import ColorButton from './common/ColorButton';
import Logo from '../images/greenstand_logo.svg';

const useStyles = makeStyles()((theme) => ({
  contentWrapper: {
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    justifyContent: 'center',
  },
  media: {
    height: 128,
    width: 128,
    [theme.breakpoints.down('md')]: {
      height: 80,
      width: 80,
    },
    float: 'left',
    boxSizing: 'border-box',
  },
}));

function InformationCard1({
  entityName,
  entityType,
  buttonText,
  cardImageSrc,
  link,
  rotation,
}) {
  const { classes } = useStyles();
  const theme = useTheme();

  log.warn('rotation', rotation);

  return (
    <Card
      elevation={0}
      className={classes.container}
      display="flex"
      sx={{
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
        boxSizing: 'border-box',
        height: 'fit-content',
        p: [4, 6],
        borderRadius: 4,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            filter: 'drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.25))',
            transform: rotation && `rotate(${rotation}deg)`,
          }}
          className={classes.media}
          src={cardImageSrc}
          title="Contemplative Reptile"
        />
        <Box
          className={classes.contentWrapper}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            sx={{
              color: 'darkGrey.main',
            }}
          >
            {entityType}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Lato',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'darkGrey.main',
            }}
          >
            {entityName}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: [4, 6] }} />
      <Link href={link}>
        <ColorButton>{buttonText}</ColorButton>
      </Link>
    </Card>
  );
}

export default InformationCard1;
