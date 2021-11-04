import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import log from 'loglevel';
import Image from 'next/image';
import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useMapContext } from '../../mapContext';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#474B4F',
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
}));

export default function Tree({ tree, planter, organization }) {
  const classes = useStyles();
  const mapContext = useMapContext();

  log.warn('map:', mapContext);
  const { verified, token_id, photo_url } = tree;
  const isTokenIssued = Boolean(token_id);

  React.useEffect(() => {
    // manipulate the map
    if (mapContext.map) {
      mapContext.map.flyTo(tree.lat, tree.lon, 16);
    }
  }, [mapContext.map]);

  const Title = () => (
    <Typography className={classes.title} variant="h2">
      {tree.species} - {tree.id}
    </Typography>
  );

  const Badges = () => (
    <Box className={classes.badges}>
      <VerifiedBadge verified={verified} badgeName="Tree Verified" />
      <VerifiedBadge verified={isTokenIssued} badgeName="Token Issued" />
    </Box>
  );

  const TreeImage = () => (
    <Box className={classes.imageContainer}>
      <Image
        src={photo_url}
        layout="fill"
        objectPosition="center"
        objectFit="cover"
      />
      <div>
        Planter:
        {planter.first_name}
        <Image src={planter.photo_url} width="100px" height="100px" />
      </div>
      <div>
        Organization:
        {organization.name}
        <Image src={organization.photo_url} width="100px" height="100px" />
      </div>
      <div>planted on: ${tree.time_created}</div>
      <div>
        lat,lon: ${tree.lat},${tree.lon}
      </div>
    </Box>
  );

  return (
    <PageWrapper className={classes.root}>
      <Title />
      <Typography className={classes.title} variant="h4">
        Eco-Peace-Vision
      </Typography>
      <Badges />
      <TreeImage />
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  log.warn('params:', params);
  log.warn('host:', process.env.NEXT_PUBLIC_API_NEW);

  const props = {};
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/trees/${params.treeid}`;
    log.warn('url:', url);

    const res = await fetch(url);
    const tree = await res.json();
    log.warn('response:', tree);
    props.tree = tree;
  }
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/planters/${props.tree.planter_id}`;
    log.warn('url:', url);

    const res = await fetch(url);
    const planter = await res.json();
    log.warn('response:', planter);
    props.planter = planter;
  }
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/organizations/${props.tree.planting_organization_id}`;
    log.warn('url:', url);

    const res = await fetch(url);
    const organization = await res.json();
    log.warn('response:', organization);
    props.organization = organization;
  }

  return {
    props,
  };
}
