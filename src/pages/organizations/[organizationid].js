import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { makeStyles } from '@mui/material/styles';
import log from 'loglevel';
import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
// import placeholder from '../../images/organizationsPlaceholder.png';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';


const useStyles = makeStyles((theme) => ({
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
  const mapContext = useMapContext();
  const classes = useStyles();
  const {
    name,
    area,
    country,
    created_at,
    about,
    mission,
    photo_url,
    logo_url,
  } = organization;

  React.useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && organization) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          map_name: organization.name,
        });
        // TODO why I must try/catche this?
        try {
          await map.loadInitialView();
          map.rerender();
        } catch (e) {
          log.error('rendering map:', e);
        }
      } else {
        log.warn('no data:', map, organization);
      }
    }
    reload();
  }, [mapContext.map]);
  return (
    <PageWrapper>
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
        <img src={photo_url} />
        <img src={logo_url} />
      </Box>
      <div>
        <h5>Tree planted: {organization?.featuredTrees?.total} </h5>
        <h5>featured tree</h5>
        <div>
          {organization?.featuredTrees?.trees?.map((tree) => (
            <div key={tree.id}>
              <Avatar src={tree.photo_url} />
              <h5>{tree.name}</h5>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h5>Associated planters: {organization?.associatedPlanters?.total} </h5>
        <h5>featured planters</h5>
        <div>
          {organization?.associatedPlanters?.planters?.map((planter) => (
            <div key={planter.id}>
              <Avatar src={planter.photo_url} />
              <h5>{planter.name}</h5>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h5>Species: {organization?.species?.total} </h5>
        <h5>featured species</h5>
        <div>
          {organization?.species?.species?.map((species) => (
            <div key={species.id}>
              <p>{species.name}</p>
            </div>
          ))}
        </div>
      </div>
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
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  const url = `${process.env.NEXT_PUBLIC_API_NEW}/organizations/${params.organizationid}`;
  const res = await fetch(url);
  const organization = await res.json();
  const props = { organization };

  {
    const { featured_trees, associated_planters, species } =
      props.organization.links;
    props.organization.featuredTrees = await utils.requestAPI(featured_trees);
    props.organization.associatedPlanters = await utils.requestAPI(
      associated_planters,
    );
    props.organization.species = await utils.requestAPI(species);
    log.warn(
      'get trees: %d, planters: %d, species: %d',
      props.organization.featuredTrees.total,
      props.organization.associatedPlanters.total,
      props.organization.species.total,
    );
  }

  return {
    props: {
      organization,
    },
  };
}
