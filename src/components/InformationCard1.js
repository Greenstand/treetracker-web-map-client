import { Box, Button, CardMedia, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';
import Logo from '../images/greenstand_logo.svg';

const useStyles = makeStyles()((theme) => ({
  container: {
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4),
    },
    borderRadius: theme.spacing(4),
  },
  contentWrapper: {
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    justifyContent: 'center',
  },
  button: {
    background: theme.palette.background.OrangeGreenGradient,
    height: 52,
    borderRadius: theme.spacing(6),
    boxShadow: '0px 8px 16px rgba(97, 137, 47, 0.25)',
    textTransform: 'none',
    fontSize: '1.25rem',
    letterSpacing: '0.02em',
    lineHeight: theme.spacing(6),
    marginTop: theme.spacing(5),
    color: theme.palette.textPrimary.main,
  },
  media: {
    height: 110,
    width: 110,
    borderRadius: '50%',
    float: 'left',
  },
}));

function InformationCard1({
  entityName,
  entityType,
  buttonText,
  cardImageSrc,
  link,
}) {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <Box
      className={classes.container}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        background:
          entityType === 'Planting Organization'
            ? theme.palette.background.greenOrangeLightGr
            : theme.palette.background.greenOrangeLightGrInverse,
      }}
    >
      <div>
        <CardMedia
          className={classes.media}
          image={cardImageSrc || Logo}
          title="Contemplative Reptile"
        />
        <Box
          className={classes.contentWrapper}
          height={110}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography>{entityType}</Typography>
          <Typography
            variant="h4"
            sx={{ fontFamily: ['Lato'], letterSpacing: '0.02em' }}
          >
            {entityName}
          </Typography>
        </Box>
      </div>
      <Link href={link}>
        <Button className={classes.button} fullWidth>
          <Typography variant="h5">{buttonText}</Typography>
        </Button>
      </Link>
    </Box>
  );
}

export default InformationCard1;
