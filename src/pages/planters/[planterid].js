import { Avatar, Button, Typography } from '@material-ui/core';
import log from 'loglevel';

import Link from '../../components/Link';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';

export default function Planter({ planter }) {
  const mapContext = useMapContext();

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
    <div>
      planter
      <Typography variant="h6">{planter.first_name}</Typography>
      <Avatar alt={planter.first_name} src={planter.photo_url} />
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
    </div>
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
