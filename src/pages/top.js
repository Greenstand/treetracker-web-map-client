import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import SearchButton from 'components/SearchButton';
import FeaturedTreesSlider from '../components/FeaturedTreesSlider';
import LeaderBoard from '../components/LeaderBoard';
import Filter from '../components/common/Filter';
import { useMapContext } from '../mapContext';
import * as utils from '../models/utils';

export default function Top({ trees, countries }) {
  // use map context to get the map
  const { map } = useMapContext();

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  async function handleCountryClick(countryId) {
    log.debug('handleCountryClick', countryId);
    // use utils.requestAPI to request API
    const country = await utils.requestAPI(`/countries/${countryId}`);
    // print country
    log.debug('country', country);

    const [lon, lat] = JSON.parse(country.centroid).coordinates;

    map.flyTo(lat, lon, 6);
  }

  function handleFilter(filter) {
    log.warn('handleFilter', filter);
    if (!map) return;
    map.setFilters({
      timeline: `${filter.startDate}_${filter.endDate}`,
    });
    map.rerender();
  }

  return (
    <Box px={4} py={3} sx={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {!isMobileScreen && (
        <Stack direction="row" justifyContent="flex-end" mb={6.125}>
          <SearchButton />
        </Stack>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Filter onFilter={handleFilter} />
      </Box>
      <Box>
        <FeaturedTreesSlider trees={trees} />
      </Box>
      <Typography variant="h3" sx={{ color: 'textPrimary.main' }}>
        Check out the global leaders in the tree planting effort
      </Typography>
      <LeaderBoard
        countries={countries}
        handleCountryClick={handleCountryClick}
      />
    </Box>
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
    const url = `${process.env.NEXT_PUBLIC_API_NEW}/countries/leaderboard`;
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
