import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import React from 'react';
import SearchButton from 'components/SearchButton';
import { getCountryLeaderboard, getFeaturedTrees } from 'models/api';
import FeaturedPlantersSlider from '../components/FeaturedPlantersSlider';
import FeaturedTreesSlider from '../components/FeaturedTreesSlider';
import LeaderBoard from '../components/LeaderBoard';
// import SearchFilter from '../components/SearchFilter';
import TagChips from '../components/TagChips';
import Filter from '../components/common/Filter';
import search from '../images/search.svg';
import { useMapContext } from '../mapContext';
import * as utils from '../models/utils';

function Top({ trees, planters, countries }) {
  // use map context to get the map
  const { map } = useMapContext();

  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  const continentTags = [
    'Global',
    'Africa',
    'Americas',
    'Asia',
    // 'Caribbean',
    // 'Europe',
    'Oceania',
  ];

  const [continentTag, setContinentTag] = React.useState('Global');
  const [leaderboardCountries, setLeaderboardCountries] =
    React.useState(countries);

  React.useEffect(() => {
    const fetchCountries = async () => {
      const data = await utils.requestAPI(
        `/countries/leaderboard?continent=${continentTag}`,
      );
      setLeaderboardCountries(data.countries);
    };
    fetchCountries();
  }, [continentTag]);

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
      {!isMobileScreen && false && (
        <Stack direction="row" justifyContent="flex-end" mb={6.125}>
          <SearchButton />
        </Stack>
      )}

      {/* {!isMobileScreen && <SearchFilter />} */}

      <Box
        sx={{
          height: 13,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Featured trees this week</Typography>
        <Box>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={search} alt="search" />
        </Box>
      </Box>
      {false && ( // going to be replaced by search filter component
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Filter onFilter={handleFilter} />
        </Box>
      )}
      <Box>
        <FeaturedTreesSlider trees={trees} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography variant="h4">Featured planters this week</Typography>
      </Box>
      <FeaturedPlantersSlider planters={planters} />
      <Typography
        variant="h4"
        sx={{
          marginTop: 8,
        }}
      >
        Check out the global leaders in the tree planting effort
      </Typography>
      <Box
        sx={{
          padding: (t) => [t.spacing(4, 0, 0, 0), t.spacing(8, 0, 0, 0)],
        }}
      >
        <TagChips
          tagItems={continentTags}
          onSelectTag={(continent) => {
            setContinentTag(continent);
          }}
        />
      </Box>
      <Box sx={{ marginTop: 18 }} />
      <LeaderBoard
        countries={leaderboardCountries}
        handleCountryClick={handleCountryClick}
      />
    </Box>
  );
}

export async function getServerSideProps() {
  const [trees, countries, planters] = await Promise.all([
    getFeaturedTrees(), //
    getCountryLeaderboard(),
    (async () => {
      const data = await utils.requestAPI('/planters?limit=10');
      log.warn('planters', data);
      return data.planters;
    })(),
  ]);
  return {
    props: {
      trees,
      countries,
      planters,
    },
  };
}

Top.isFloatingDisabled = true;
export default Top;
