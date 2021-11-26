import { Avatar, Button, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import log from 'loglevel';
import Image from 'next/image';

import Location from '../../components/common/Location';
import Time from '../../components/common/Time';
import Link from '../../components/Link';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';

// make styles for component with material-ui
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  badges: {
    marginTop: 8,
    '&>*': {
      marginRight: 8,
    },
  },
  title: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '36px',
    lineHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
  },
}));

export default function Planter({ planter }) {
  const mapContext = useMapContext();

  const classes = useStyles();

  React.useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && planter) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          userid: planter.id,
        });
        await map.loadInitialView();
        map.rerender();
      } else {
        log.warn('no data:', map, planter);
      }
    }
    reload();
  }, [mapContext.map]);

  return (
    <PageWrapper className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {planter.first_name} {planter.last_name}
      </Typography>
      <Box className={classes.badges}>
        <VerifiedBadge verified={true} badgeName="Verified Planter" />
        <VerifiedBadge verified={false} badgeName="Seeking Orgs" />
      </Box>
      <Box className={classes.box1}>
        <Location entityLocation="Shirimatunda,Tanzania" />
        <Time entityName={planter.created_time} />
      </Box>
      <Box
        style={{ height: '672px' /* TODO hard code */ }}
        className={classes.imageContainer}
      >
        <Image
          src={planter.photo_url}
          layout="fill"
          objectPosition="center"
          objectFit="cover"
        />
      </Box>
      <Typography variant="h6">
        Tree planted: {planter.featuredTrees.total}
      </Typography>
      {planter.featuredTrees.trees.map((tree) => (
        <div key={tree.id}>
          <Typography variant="h6">{tree.name}</Typography>
          <Avatar alt={tree.name} src={tree.photo_url} />
        </div>
      ))}
      <Typography variant="h6">
        Associated Organizations: {planter.associatedOrganizations.total}
      </Typography>
      {planter.associatedOrganizations.organizations.map((org) => (
        <div key={org.id}>
          <Link href={`/organizations/${org.id}`}>
            <Typography variant="h6">{org.name}</Typography>
            <Avatar alt={org.name} src={org.photo_url} />
          </Link>
        </div>
      ))}
      <Typography variant="h6">Species of trees planted</Typography>
      {planter.species.species.map((species) => (
        <div key={species.id}>
          <Typography variant="subtitle2">{species.name}</Typography>
          <Typography variant="body1">count: {species.count}</Typography>
        </div>
      ))}
      <Typography variant="h6">About</Typography>
      <Typography variant="body1">{planter.about}</Typography>
      <Typography variant="h6">Mission</Typography>
      <Typography variant="body1">{planter.mission}</Typography>
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
