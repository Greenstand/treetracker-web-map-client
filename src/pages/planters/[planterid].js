import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
// import Image from 'next/image';
import { useEffect, useState } from 'react';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import FeaturedTreesSlider from '../../components/FeaturedTreesSlider';
import InformationCard1 from '../../components/InformationCard1';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import CustomCard from '../../components/common/CustomCard';
import DataTag from '../../components/common/DataTag';
import { useMapContext } from '../../mapContext';
import { makeStyles } from '../../models/makeStyles';
import * as utils from '../../models/utils';

// make styles for component with material-ui
const useStyles = makeStyles()((theme) => ({
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  treeSlider: {
    marginTop: theme.spacing(10),
  },
  divider: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(14),
      marginBottom: theme.spacing(14),
    },
  },
  textColor: {
    color: theme.palette.textPrimary.main,
  },
}));

const formatDates = (date) =>
  moment(date, 'ddd MMM DD YYYY HH:mm:ss').format('LL');

export default function Planter({ planter }) {
  const mapContext = useMapContext();

  const [isPlanterTab, setIsPlanterTab] = useState(true);

  const { classes } = useStyles();

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && planter) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          userid: planter.id,
        });
        try {
          await map.loadInitialView();
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
      } else {
        log.warn('no data:', map, planter);
      }
    }
    reload();
  }, [mapContext.map]);

  function handleCardClick() {
    setIsPlanterTab(!isPlanterTab);
  }

  return (
    <PageWrapper>
      <Typography variant="h2" className={classes.textColor}>
        {planter.first_name} {planter.last_name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <VerifiedBadge verified badgeName="Verified Planter" />
        <VerifiedBadge verified={false} badgeName="Seeking Orgs" />
      </Box>
      <Stack gap={2.5} sx={{ my: 2 }}>
        <DataTag data={formatDates(planter.created_time)} />
        <DataTag data="Shirimatunda,Tanzania" location />
      </Stack>
      <Divider variant="fullWidth" sx={{ mt: 6, mb: 9.5 }} />
      {/* <Box
        style={{ height: '672px'  }}
        className={classes.imageContainer}
      >
        <Image
          src={planter.photo_url}
          layout="fill"
          objectPosition="center"
          objectFit="cover"
        />
      </Box> */}
      <Avatar
        src={planter.photo_url}
        variant="rounded"
        sx={{ width: '100%', height: '688px', borderRadius: 6, marginTop: 6 }}
      />
      <Grid
        container
        spacing={2}
        wrap="nowrap"
        justifyContent="center"
        sx={{ width: '100%' }}
      >
        <Grid item sx={{ width: '50%' }}>
          <CustomCard
            handleClick={handleCardClick}
            icon={<ParkOutlinedIcon fontSize="large" />}
            title="Trees Planted"
            text={planter.featuredTrees.total}
            disabled={!isPlanterTab}
          />
        </Grid>
        <Grid item sx={{ width: '50%' }}>
          <CustomCard
            handleClick={handleCardClick}
            icon={<GroupsOutlinedIcon fontSize="large" />}
            title="Ass. Orgs"
            text={planter.associatedOrganizations.total}
            disabled={!!isPlanterTab}
          />
        </Grid>
      </Grid>
      {isPlanterTab && (
        <>
          <Typography
            variant="h4"
            sx={{ fontSize: 24, color: 'textPrimary.main' }}
          >
            Explore some trees planted by <strong>{planter.first_name}</strong>
          </Typography>
          <Box className={classes.treeSlider}>
            <FeaturedTreesSlider trees={planter.featuredTrees.trees} />
          </Box>
        </>
      )}
      {!isPlanterTab &&
        planter.associatedOrganizations.organizations.map((org) => (
          <div key={org.id}>
            <InformationCard1
              entityName={org.name}
              entityType="Planting Organization"
              buttonText="Meet the Organization"
              cardImageSrc={org?.logo_url}
              link={`/organizations/${org.id}`}
            />
          </div>
        ))}
      <Typography variant="h4" sx={{ fontSize: 24, color: 'textPrimary.main' }}>
        Species of trees planted
      </Typography>
      <Box className={classes.speciesBox}>
        {planter.species.species.map((species) => (
          <TreeSpeciesCard
            key={species.id}
            name={species.name}
            scientificName={species.scientificName}
            count={species.count}
          />
        ))}
      </Box>
      <Divider varian="fullwidth" className={classes.divider} />
      <Typography
        variant="h4"
        className={classes.textColor}
        sx={{ mt: { xs: 12, md: 20 }, fontWeight: 600 }}
      >
        About
      </Typography>
      <Typography variant="body1" className={classes.textColor} mt={7}>
        {planter.about}
      </Typography>
      <Typography
        variant="h4"
        className={classes.textColor}
        sx={{ mt: { xs: 10, md: 16 }, fontWeight: 600 }}
      >
        Mission
      </Typography>
      <Typography variant="body1" className={classes.textColor} mt={7}>
        {planter.mission}
      </Typography>
      <Divider varian="fullwidth" className={classes.divider} />
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  log.warn('params:', params);
  log.warn('host:', process.env.NEXT_PUBLIC_API_NEW);

  const props = {};
  {
    const url = `/planters/${params.planterid}`;
    log.warn('url:', url);

    const planter = await utils.requestAPI(url);
    log.warn('response:', planter);
    props.planter = planter;
  }

  {
    const { featured_trees, associated_organizations, species } =
      props.planter.links;
    props.planter.featuredTrees = await utils.requestAPI(featured_trees);
    props.planter.associatedOrganizations = await utils.requestAPI(
      associated_organizations,
    );
    props.planter.species = await utils.requestAPI(species);
  }

  return {
    props,
  };
}
