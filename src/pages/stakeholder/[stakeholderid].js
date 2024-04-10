import { Box, Divider, Grid, Typography, Avatar } from '@mui/material';
import Portal from '@mui/material/Portal';
import log from 'loglevel';
import { marked } from 'marked';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import Badge from 'components/Badge';
import CustomWorldMap from 'components/CustomWorldMap';
import FeaturedTreesSlider from 'components/FeaturedTreesSlider';
import HeadTag from 'components/HeadTag';
import ImpactSection from 'components/ImpactSection';
import PlanterQuote from 'components/PlanterQuote';
import ProfileAvatar from 'components/ProfileAvatar';
import ProfileCover from 'components/ProfileCover';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import Crumbs from 'components/common/Crumbs';
import CustomCard from 'components/common/CustomCard';
import Icon from 'components/common/CustomIcon';
import Info from 'components/common/Info';
import { useDrawerContext } from 'context/DrawerContext';
import { useMobile } from 'hooks/globalHooks';
import CalendarIcon from 'images/icons/calendar.svg';
import LocationIcon from 'images/icons/location.svg';
import PeopleIcon from 'images/icons/people.svg';
import TreeIcon from 'images/icons/tree.svg';
import imagePlaceholder from 'images/image-placeholder.png';
import SearchIcon from 'images/search.svg';
import { useMapContext } from 'mapContext';
import {
  getOrganizationById,
  getOrgLinks,
  getStakeholderById,
} from 'models/api';
import * as pathResolver from 'models/pathResolver';
import {
  getLocationString,
  getContinent,
  wrapper,
  requestAPI,
} from 'models/utils';

export default function Stakeholder(props) {
  log.warn('props for stakeholder page:', props);
  const { stakeholder, nextExtraIsEmbed } = props;
  const mapContext = useMapContext();
  const [isPlanterTab, setIsPlanterTab] = React.useState(true);
  // eslint-disable-next-line
  const [continent, setContinent] = React.useState(null);
  const router = useRouter();
  const isMobile = useMobile();
  const { featuredTrees, associated_planters } = stakeholder;
  console.log('planters', associated_planters.planters);
  const { setTitlesData } = useDrawerContext();

  async function updateContinent() {
    const tree = stakeholder?.featuredTrees?.trees[0];
    if (tree) {
      const { lat, lon } = tree;
      const newContinent = await getContinent(lat, lon);
      setContinent(newContinent.name);
    }
  }

  useEffect(() => {
    setTitlesData({
      name: stakeholder.map,
      createAt: stakeholder.created_at,
    });
  }, [stakeholder.created_at, stakeholder.map, setTitlesData]);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && stakeholder) {
        // map.flyTo(tree.lat, tree.lon, 16);
        await map.setFilters({
          map_name: stakeholder.map,
        });
        const bounds = pathResolver.getBounds(router);
        if (bounds) {
          log.warn('goto bounds found in url');
          await map.gotoBounds(bounds);
        } else {
          const view = await map.getInitialView();
          await map.gotoView(view.center.lat, view.center.lon, view.zoomLevel);
        }
      } else {
        log.warn('no data:', map, stakeholder);
      }
    }
    reload();

    updateContinent();
    // eslint-disable-next-line
  }, [mapContext, stakeholder]);

  const logo_url = stakeholder.logo_url || imagePlaceholder;
  const name =
    stakeholder.first_name && stakeholder.last_name
      ? `${stakeholder.first_name} ${stakeholder.last_name}`
      : '---';
  const org_name = stakeholder.org_name || '---';

  const BadgeSection = useMemo(
    () => (
      <>
        <Badge color="primary" verified badgeName="Verified Organization" />
        <Badge color="greyLight" badgeName="Seeking Planter" />
      </>
    ),
    [],
  );

  return (
    <>
      <HeadTag title={`${name} - Stakeholder`} />
      <Box
        sx={[
          {
            padding: (t) => [t.spacing(0, 4), 6],
            width: 1,
            boxSizing: 'border-box',
          },
          nextExtraIsEmbed && {
            padding: (t) => [t.spacing(0, 4), 6 * 0.6],
          },
        ]}
      >
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
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
                  icon: logo_url,
                  name: `${org_name}`,
                },
              ]}
            />

            <Icon
              icon={SearchIcon}
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
        )}

        <Box
          sx={{
            mt: 6,
          }}
        >
          <ProfileCover src={stakeholder.cover_url} />
          <ProfileAvatar src={logo_url} />
        </Box>

        {!isMobile && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h2">{name}</Typography>
            <Box sx={{ mt: 2 }}>
              <Info iconURI={PeopleIcon} info=<> Organization: {org_name}</> />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={
                  <>
                    Stakeholder since
                    <time dateTime={stakeholder?.created_at}>
                      {` ${moment(stakeholder?.created_at).format(
                        'MMMM DD, YYYY',
                      )}`}
                    </time>
                  </>
                }
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(stakeholder.map)}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                gap: 2,
                display: 'flex',
              }}
            >
              {BadgeSection}
            </Box>
          </Box>
        )}

        {isMobile && (
          <Portal
            container={() => document.getElementById('drawer-title-container')}
          >
            <Box
              sx={{
                px: 4,
                pb: 4,
              }}
            >
              <Typography variant="h2">{name}</Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={CalendarIcon}
                  info={<>Organization: {org_name}</>}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={LocationIcon}
                  info={getLocationString(stakeholder.map)}
                />
              </Box>
              <Box
                sx={{
                  mt: 4,
                  gap: 2,
                  display: 'flex',
                }}
              >
                {BadgeSection}
              </Box>
            </Box>
          </Portal>
        )}
        {isMobile && (
          <Portal
            container={() =>
              document.getElementById('drawer-title-container-min')
            }
          >
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={logo_url}
                sx={{
                  width: 32,
                  height: 32,
                }}
              />
              <Typography variant="h3">{name}</Typography>
            </Box>
          </Portal>
        )}

        <Box
          sx={{
            mt: [8, 16],
          }}
        >
          <Typography variant="h4">Featured trees by {name}</Typography>
          <FeaturedTreesSlider
            trees={featuredTrees.trees}
            link={(item) => `/trees/${item.id}`}
          />
          <Grid
            container
            wrap="nowrap"
            justifyContent="space-between"
            sx={{
              width: 1,
              mt: [6, 12],
            }}
          >
            <Grid item sx={{ width: '49%' }}>
              <CustomCard
                handleClick={() => setIsPlanterTab(true)}
                iconURI={TreeIcon}
                iconProps={{
                  sx: {
                    '& path': {
                      fill: ({ palette }) => palette.primary.main,
                    },
                  },
                }}
                title="Tree Captures Collected"
                text={stakeholder?.featuredTrees?.total || '---'}
                disabled={!isPlanterTab}
              />
            </Grid>
            <Grid item sx={{ width: '49%' }}>
              <CustomCard
                handleClick={() => setIsPlanterTab(false)}
                iconURI={PeopleIcon}
                iconProps={{
                  sx: {
                    '& path': {
                      fill: ({ palette }) => palette.text.primary,
                    },
                  },
                }}
                title="Hired Planters"
                text={associated_planters.total || '---'}
                disabled={isPlanterTab}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              px: [0, 6],
              display: isPlanterTab ? 'block' : 'none',
            }}
          >
            <Box sx={{ mt: [0, 22] }}>
              <CustomWorldMap
                totalTrees={
                  (stakeholder?.featuredTrees?.total &&
                    stakeholder?.featuredTrees?.total) ||
                  undefined
                }
                con={stakeholder?.continent_name || 'af'}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: [16, 24],
                mt: [0, 20],
              }}
            >
              Species of trees planted
            </Typography>
            {stakeholder?.species?.species?.length > 0 ? (
              <Box component="ul" sx={{ mt: [5, 10], listStyle: 'none', p: 0 }}>
                {stakeholder?.species?.species?.map((s) => (
                  <li key={s.name}>
                    <TreeSpeciesCard
                      name={s.name}
                      subTitle={s.desc || '---'}
                      count={s.count}
                    />
                    <Box sx={{ mt: [2, 4] }} />
                  </li>
                ))}
              </Box>
            ) : (
              <Typography variant="h5">NO DATA YET</Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            mt: [11, 22],
            display: !isPlanterTab ? 'block' : 'none',
          }}
        >
          {/* {associated_planters?.planters?.map((planter) => (
            <PlanterQuote
              // id={planter.id}
              // name={planter.first_name}
              key={planter.id}
              planter={planter}
              // quote={planter.about.slice(0, 150)}
              // photo={planter.image_url}
              // initialDate={planter.created_time}
              // location={planter.country}
            />
          ))} */}
          {/* Placeholder quote card, remove after API gets data */}
          {/* {[
              {
                name: 'Jirgna O',
                quote: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
                nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
                velit ipsa illo, odit unde atque doloribus tempora distinctio facere
                dolorem expedita error.`,
                photo:
                  'https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg',
                location: 'Shiramtunda, Tanzania',
              },
              {
                name: 'Samwell A',
                quote: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
                nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
                velit ipsa illo, odit unde atque doloribus tempora distinctio facere
                dolorem expedita error.`,
                photo:
                  'https://treetracker-production.nyc3.digitaloceanspaces.com/2018.11.20.12.11.07_e7a81cf4-2d37-45ee-9d5a-47bdfd7c43cc_IMG_20181120_121037_7990135604649410080.jpg',
                location: 'Addis Ababa, Ethisa',
              },
            ].map((planter, i) => ( */}
          {associated_planters?.planters?.length > 0 ? (
            <Box component="ul" sx={{ mt: [6, 12], listStyle: 'none', p: 0 }}>
              {associated_planters?.planters
                ?.sort((e1) => (e1.about ? -1 : 1))
                .map((planter, i) => (
                  <Box component="li" key={planter.name} sx={{ mt: [6, 12] }}>
                    <PlanterQuote planter={planter} reverse={i % 2 !== 0} />
                  </Box>
                ))}
            </Box>
          ) : (
            <Typography variant="h5">NO DATA YET</Typography>
          )}
        </Box>

        <Box
          sx={{
            px: [24 / 8, 24 / 4],
            mt: [80 / 8, 80 / 4],
          }}
        >
          <Box sx={{ height: 80 }} />
        </Box>
      </Box>
      {nextExtraIsEmbed && (
        <Portal
          container={() => document.getElementById('embed-logo-container')}
        >
          <Avatar
            sx={{
              width: '120px',
              height: '120px',
              margin: '10px',
            }}
            src={stakeholder.logo_url || imagePlaceholder}
            variant="rounded"
          />
        </Portal>
      )}
    </>
  );
}

async function serverSideData(params) {
  console.log('serverSideData');
  console.log(params);
  const id = params.stakeholderid;
  const stakeholder = await getStakeholderById(id);
  const [featuredTrees, associated_planters, species] = await Promise.all([
    (async () => {
      const data = await requestAPI(`/trees?stakeholder_id=${id}`);
      return data;
    })(),
    (async () => {
      const data = await requestAPI(`/planters?stakeholder_id=${id}`);
      return data;
    })(),
    (async () => {
      const data = await requestAPI(`/species?stakeholder_id=${id}`);
      return data;
    })(),
  ]);
  // const organization = await getOrganizationById(stakeholder.organization_id);
  // const orgLinks = await getOrgLinks(organization.links);
  const props = {
    stakeholder: {
      ...stakeholder,
      featuredTrees,
      associated_planters,
      species,
      // ...orgLinks,
    },
  };
  return props;
}

const getStaticProps = wrapper(async ({ params }) => {
  const props = await serverSideData(params);
  return {
    props,
    revalidate: Number(process.env.NEXT_CACHE_REVALIDATION_OVERRIDE) || 30,
  };
});

// eslint-disable-next-line
const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export { getStaticProps, getStaticPaths };
