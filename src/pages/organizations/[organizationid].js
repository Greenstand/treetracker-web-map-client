import VerifiedBadge from '../../components/VerifiedBadge';
import { Button, Box, Divider, Typography, Chip } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { makeStyles } from '@material-ui/core/styles';
import placeholder from '../../images/organizationsPlaceholder.png';

const useStyles = makeStyles((theme) => ({
  organizationPage: {
    overflowY: 'scroll',
    background: 'white',
    padding: '12px 20px',
  },
  backButton: {
    textTransform: 'none',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.8rem',
    color: theme.palette.textSecondary.main,
    margin: '4px 0',
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
  badgeWrapper: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1),
  },
  imgContainer: {
    borderRadius: '16px',
    position: 'relative',
    height: 332,
    marginBottom: theme.spacing(4),
    '& img:nth-of-type(1)': {
      width: '100%',
      height: '100%',
    },
    '& img:nth-of-type(2)': {
      position: 'absolute',
      width: 100,
      height: 100,
      left: 10,
      bottom: 10,
    },
  },
}));

export default function Organization({ organization }) {
  const classes = useStyles();
  const {
    name,
    area,
    country,
    created_at,
    about,
    mission,
    photo_url,
  } = organization;
  return (
    <Box className={classes.organizationPage}>
      <Box display="flex" justifyContent="spaceBetween">
        <Button
          className={classes.backButton}
          color="textPrimary"
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        <Box>{/* search button */}</Box>
      </Box>
      <Typography variant="subtitle1">{name}</Typography>
      <Box className={classes.badgeWrapper}>
        <VerifiedBadge verified={true} badgeName="Verified Planter" />
        <VerifiedBadge verified={false} badgeName="Seeking Planters" />
      </Box>
      <Box className={classes.info}>
        <CalendarTodayIcon fontSize="small" />
        Planter since {created_at}
      </Box>
      <Box className={classes.info}>
        <LocationOnIcon fontSize="small" />
        {area}, {country}
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.imgContainer}>
        <img src={placeholder} />
        <img src={photo_url} />
      </Box>
      <Typography variant="subtitle2" gutterBottom>
        About the Organization
      </Typography>
      <Typography variant="body2">{about}</Typography>
      <br />
      <Typography variant="subtitle2" gutterBottom>
        Mission
      </Typography>
      <Typography variant="body2" gutterBottom>
        {mission}
      </Typography>
      <br />
      <Typography variant="subtitle2" gutterBottom>
        Check out the planting effort in action
      </Typography>
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  const url = `${process.env.NEXT_PUBLIC_API_NEW}/organizations/${params.organizationid}`;
  const res = await fetch(url);
  const organization = await res.json();

  return {
    props: {
      organization,
    },
  };
}
