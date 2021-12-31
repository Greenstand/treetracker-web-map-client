import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { Avatar, Box, Divider, Grid, Typography } from '@mui/material';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import log from 'loglevel';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

import CustomCard from '../../components/common/CustomCard';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
// import placeholder from '../../images/organizationsPlaceholder.png';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';

const useStyles = makeStyles()((theme) => ({
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
    '&> img': {
      width: '100%',
      height: '100%',
    },
  },
  logoContainer: {
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    left: theme.spacing(4),
    bottom: theme.spacing(4),
    boxSizing: 'border-box',
    padding: theme.spacing(5),
    width: 108,
    height: 108,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&> img': {
      width: '100%',
    },
  },
}));

export default function Organization({ organization }) {
  const mapContext = useMapContext();
  const { classes } = useStyles();
  const [isPlanterTab, setIsPlanterTab] = React.useState(false);
  const [continent, setContinent] = React.useState(null);
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

  async function updateContinent() {
    const tree = organization?.featuredTrees?.trees[0];
    if (tree) {
      const { lat, lon } = tree;
      const continent = await utils.getContinent(lat, lon);
      setContinent(continent.name);
    }
  }

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

    updateContinent();
  }, [mapContext.map]);

  function handleCardClick() {
    setIsPlanterTab(!isPlanterTab);
  }

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
        <Box className={classes.logoContainer}>
          <img src={logo_url} />
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item>
          <CustomCard
            handleClick={handleCardClick}
            icon={<ParkOutlinedIcon />}
            title="Trees Planted"
            text={organization?.featuredTrees?.total}
            disabled={!!isPlanterTab}
          />
        </Grid>
        <Grid item>
          <Box width={8} />
        </Grid>
        <Grid item>
          <CustomCard
            handleClick={handleCardClick}
            icon={<GroupsOutlinedIcon />}
            title="Associated Organizations"
            text={organization?.associatedPlanters?.total}
            disabled={!isPlanterTab}
          />
        </Grid>
      </Grid>
      {!isPlanterTab && (
        <div>
          {/* TODO replace with the world map component */}
          <h5>The world map</h5>
          <h5>
            {organization?.associatedPlanters?.total} tree planted in continent{' '}
            {continent}{' '}
          </h5>
        </div>
      )}
      {isPlanterTab && (
        <div>
          {/* TODO replace with the planter quote card https://github.com/Greenstand/treetracker-web-map-client/issues/334 */}
          <h5>
            Associated planters: {organization?.associatedPlanters?.total}{' '}
          </h5>
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
      )}
      <Box className={classes.speciesBox}>
        {organization?.species.species.map((species) => (
          <TreeSpeciesCard
            key={species.id}
            name={species.name}
            scientificName={species.scientificName}
            count={species.count}
          />
        ))}
      </Box>
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
