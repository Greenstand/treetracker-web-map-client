import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import React from 'react';
import HeadTag from 'components/HeadTag';
import SearchButton from 'components/SearchButton';
import { getCountryLeaderboard, getFeaturedTrees } from 'models/api';
import FeaturedPlantersSlider from '../components/FeaturedPlantersSlider';
import FeaturedTreesSlider from '../components/FeaturedTreesSlider';
import LeaderBoard from '../components/LeaderBoard';
// import SearchFilter from '../components/SearchFilter';
import TagChips from '../components/TagChips';
import Crumbs from '../components/common/Crumbs';
import Icon from '../components/common/CustomIcon';
import Filter from '../components/common/Filter';
import { useFullscreen } from '../hooks/globalHooks';
import Search from '../images/search.svg';
import { useMapContext } from '../mapContext';
import * as utils from '../models/utils';

function Top(props) {
  log.warn('props top:', props);
  const { trees, planters, countries, organizations, wallets } = props;
  // use map context to get the map
  const { map } = useMapContext();
  const isFullscreen = useFullscreen();

  const continentTags = [
    'Global',
    'Africa',
    'Europe',
    'North America',
    'Asia',
    'South America',
    'Australia',
  ];

  const [continentTag, setContinentTag] = React.useState('Global');
  const [leaderboardCountries, setLeaderboardCountries] =
    React.useState(countries);

  const mapContext = useMapContext();

  React.useEffect(() => {
    async function reload() {
      if (mapContext.map) {
        await mapContext.map.setFilters({});
      }
    }
    reload();
  }, [mapContext.map]);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED === 'true')
      return;
    const fetchCountries = async () => {
      const data = await utils.requestAPI(
        `/countries/leaderboard/${continentTag}`,
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
    map.gotoView(lat, lon, 6);
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
    <>
      <HeadTag title="Tree Spotlight" />
      <Box px={4} py={3} sx={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        {!isFullscreen && false && (
          <Stack direction="row" justifyContent="flex-end" mb={6.125}>
            <SearchButton />
          </Stack>
        )}

        {/* {!isFullscreen && <SearchFilter />} */}

        <Box
          sx={{
            height: [4, 13],
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Crumbs
            items={[
              {
                // icon: <HomeIcon />,
                name: 'Home',
                url: '/',
              },
              {
                name: 'tree spotlight',
              },
            ]}
          />
          <Icon
            icon={Search}
            width={48}
            height={48}
            color="grey"
            sx={{
              fill: 'transparent',
              '& path': {
                fill: 'grey',
              },
            }}
          />
        </Box>
        {trees?.length > 0 && (
          <>
            <Box
              sx={{
                mt: 8,
              }}
            >
              <Typography variant="h4">Featured trees this week</Typography>
            </Box>
            {false && ( // going to be replaced by search filter component
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Filter onFilter={handleFilter} />
              </Box>
            )}
            <Box>
              <FeaturedTreesSlider trees={trees} isMobile={isFullscreen} />
            </Box>
          </>
        )}
        {organizations.length > 0 && (
          <>
            <Box sx={{ mt: [4, 8] }} />
            <Typography variant="h4">
              Featured organizations this week
            </Typography>
            <FeaturedPlantersSlider
              link={(id) => `/organizations/${id}`}
              color="primary"
              planters={organizations}
              isMobile={isFullscreen}
            />
          </>
        )}
        {planters.length > 0 && (
          <>
            <Box
              sx={{
                mt: 8,
              }}
            >
              <Typography variant="h4">Featured planters this week</Typography>
            </Box>
            <FeaturedPlantersSlider
              link={(id) => `/planters/${id}`}
              color="secondary"
              planters={planters}
              isMobile={isFullscreen}
            />
          </>
        )}
        {wallets.length > 0 && (
          <>
            <Typography variant="h4">Featured wallets this week</Typography>
            <FeaturedPlantersSlider
              link={(id) => `/wallets/${id}`}
              color="secondary"
              planters={wallets}
              isMobile={isFullscreen}
            />
          </>
        )}
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
      {isFullscreen && (
        <Portal container={document.getElementById('drawer-title-container')}>
          <Box
            sx={{
              px: 4,
              pb: 4,
            }}
          >
            <Typography variant="h2" color="primary">
              Treetracker Spotlight
            </Typography>
          </Box>
        </Portal>
      )}
      {isFullscreen && (
        <Portal
          container={document.getElementById('drawer-title-container-min')}
        >
          <Box>
            <Typography variant="h4">Treetracker Spotlight</Typography>
          </Box>
        </Portal>
      )}
    </>
  );
}

// export async function getStaticProps() {
export async function getServerSideProps() {
  const [trees, countries, planters, organizations, wallets] =
    await Promise.all([
      getFeaturedTrees(), //
      process.env.NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED === 'true'
        ? []
        : getCountryLeaderboard(),
      (async () => {
        const data = await utils.requestAPI('/planters/featured');
        log.warn('planters', data);
        return data.planters;
      })(),
      (async () => {
        const data = await utils.requestAPI('/organizations/featured');
        log.warn('organizations', data);
        return data.organizations;
      })(),
      (async () => {
        const data = await utils.requestAPI('/wallets/featured');
        log.warn('wallets', data);
        return data.wallets;
      })(),
    ]);
  return {
    props: {
      trees,
      countries,
      planters,
      organizations,
      wallets,
    },
    // revalidate: 60,
  };
}

Top.isFloatingDisabled = true;
export default Top;
