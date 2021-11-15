import Typography from '@material-ui/core/Typography';
import log from 'loglevel';

import Link from '../components/Link';
import { useMapContext } from '../mapContext';
import * as utils from '../models/utils';

export default function Top({ trees, countries }) {
  // use map context to get the map
  const mapContext = useMapContext();

  async function handleCountryClick(countryId) {
    log.debug('handleCountryClick', countryId);
    // use utils.requestAPI to request API
    const country = await utils.requestAPI(`/countries/${countryId}`);
    // print country
    log.debug('country', country);

    const { lat, lon } = country.centroid;

    const { map } = mapContext;
    map.flyTo(lat, lon, 6);
  }

  return (
    <div>
      <h1>top page</h1>
      <h2>Featured Trees</h2>
      <ul>
        {trees.map((tree) => (
          <li key={tree.id}>
            <Link href={`/trees/${tree.id}`}>
              <Typography color="secondary">tree {tree.id}</Typography>
            </Link>
          </li>
        ))}
      </ul>
      <h2>Check out the global leaders in the tree planting effort</h2>
      {countries.map((country) => (
        <li key={country.id}>
          <a onClick={() => handleCountryClick(country.id)}>
            {country.name} planted: {country.planted}
          </a>
        </li>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const props = {};
  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/trees/featured`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.trees = data.trees;
  }

  {
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/countries/leader`;
    log.warn('url:', url);

    const res = await fetch(url);
    const data = await res.json();
    log.warn('response:', data);
    props.countries = data.countries;
  }

  return {
    props,
  };
}
