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
    height: '100%',
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
    '& img': {
      width: '100%',
      height: '100%',
    },
  },
}));

export default function Organization({ organization }) {
  const classes = useStyles();
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
      <Typography variant="subtitle1">
        Greenway International Foundation
      </Typography>
      <Box className={classes.badgeWrapper}>
        <VerifiedBadge verified={true} badgeName="Verified Planter" />
        <VerifiedBadge verified={false} badgeName="Seeking Planters" />
      </Box>
      <Box className={classes.info}>
        <CalendarTodayIcon fontSize="small" />
        Planter since November 11, 2019
      </Box>
      <Box className={classes.info}>
        <LocationOnIcon fontSize="small" />
        Shirimatunda, Tanzania
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.imgContainer}>
        <img src={placeholder} />
      </Box>
      <Typography variant="subtitle2" gutterBottom>
        About the Organization
      </Typography>
      <Typography variant="body2">
        Velit nostrud velit laboris in ullamco consequat. Consequat culpa labore
        laboris magna in aute nulla commodo labore qui aute esse do. Eiusmod
        ipsum qui labore velit deserunt amet laboris mollit cupidatat anim
        aliqua. Nostrud proident tempor nisi ut exercitation nulla id commodo
        consectetur. Nulla aliqua voluptate cupidatat cillum. Reprehenderit
        exercitation reprehenderit dolor velit proident dolore culpa. Incididunt
        sint aliqua sint dolor voluptate officia nulla non Lorem.
      </Typography>
      <br />
      <Typography variant="body2" gutterBottom>
        Velit nostrud velit laboris in ullamco consequat. Consequat culpa labore
        laboris magna in aute nulla commodo labore qui aute esse do. Eiusmod
        ipsum qui labore velit deserunt amet laboris mollit cupidatat anim
        aliqua. Nostrud proident tempor nisi ut exercitation nulla id commodo
        consectetur. Nulla aliqua voluptate cupidatat cillum. Reprehenderit
        exercitation reprehenderit dolor velit proident dolore culpa. Incididunt
        sint aliqua sint dolor voluptate officia nulla non Lorem.
      </Typography>
      <br />
      <Typography variant="subtitle2" gutterBottom>
        Mission
      </Typography>
      <Typography variant="body2" gutterBottom>
        Velit nostrud velit laboris in ullamco consequat. Consequat culpa labore
        laboris magna in aute nulla commodo labore qui aute esse do. Eiusmod
        ipsum qui labore velit deserunt amet laboris mollit cupidatat anim
        aliqua. Nostrud proident tempor nisi ut exercitation nulla id commodo
        consectetur. Nulla aliqua voluptate cupidatat cillum. Reprehenderit
        exercitation reprehenderit dolor velit proident dolore culpa. Incididunt
        sint aliqua sint dolor voluptate officia nulla non Lorem.
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Check out the planting effort in action
      </Typography>
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  //api call to fetch organization information
  const organization = params.organizationid;

  return {
    props: {
      organization,
    },
  };
}
