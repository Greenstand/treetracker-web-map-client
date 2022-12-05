import { Box, Divider, Grid, Typography, Avatar } from '@mui/material';
import Portal from '@mui/material/Portal';
import log from 'loglevel';
import { marked } from 'marked';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import FeaturedTreesSlider from 'components/FeaturedTreesSlider';
import HeadTag from 'components/HeadTag';
import PlanterQuote from 'components/PlanterQuote';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import { useDrawerContext } from 'context/DrawerContext';
import { getOrganizationById, getOrgLinks } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import ImpactSection from '../../components/ImpactSection';
import ProfileAvatar from '../../components/ProfileAvatar';
import ProfileCover from '../../components/ProfileCover';
import VerifiedBadge from '../../components/VerifiedBadge';
import Crumbs from '../../components/common/Crumbs';
import CustomCard from '../../components/common/CustomCard';
import Icon from '../../components/common/CustomIcon';
import Info from '../../components/common/Info';
import { useMobile } from '../../hooks/globalHooks';
import CalendarIcon from '../../images/icons/calendar.svg';
import LocationIcon from '../../images/icons/location.svg';
import PeopleIcon from '../../images/icons/people.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
// import placeholder from '../../images/organizationsPlaceholder.png';
import { useMapContext } from '../../mapContext';
import * as pathResolver from '../../models/pathResolver';
import { getLocationString, getContinent, wrapper } from '../../models/utils';

const useStyles = makeStyles()((theme) => ({
  imgContainer: {
    borderRadius: '16px',
    position: 'relative',
    img: {
      borderRadius: '16px',
    },
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

export default function Organization(props) {
  log.warn('props for org page:', props);
  const { organization, nextExtraIsEmbed } = props;
  const mapContext = useMapContext();
  const { classes } = useStyles();
  const [isPlanterTab, setIsPlanterTab] = React.useState(true);
  // eslint-disable-next-line
  const [continent, setContinent] = React.useState(null);
  const router = useRouter();
  const isMobile = useMobile();
  const { featuredTrees } = organization;

  const { setTitlesData } = useDrawerContext();

  async function updateContinent() {
    const tree = organization?.featuredTrees?.trees[0];
    if (tree) {
      const { lat, lon } = tree;
      const newContinent = await getContinent(lat, lon);
      setContinent(newContinent.name);
    }
  }

  useEffect(() => {
    setTitlesData({
      name: organization.map_name,
      createAt: organization.created_time,
    });
  }, [organization.created_time, organization.map_name, setTitlesData]);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && organization) {
        // map.flyTo(tree.lat, tree.lon, 16);
        await map.setFilters({
          map_name: organization.map_name,
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
        log.warn('no data:', map, organization);
      }
    }
    reload();

    updateContinent();
    // eslint-disable-next-line
  }, [mapContext, organization]);

  const logo_url = organization.logo_url || imagePlaceholder;
  const name = organization.name || '---';

  return (
    <>
      <HeadTag title={`${name} - Organization`} />
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
                  name: `organization ${name}`,
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
          <ProfileCover src={organization.cover_url} />
          <ProfileAvatar src={logo_url} />
        </Box>

        {!isMobile && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h2">{name}</Typography>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={`Organization since ${moment().format('MMMM DD, YYYY')}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(
                  organization.country_name,
                  organization.continent_name,
                )}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                gap: 2,
                display: 'flex',
              }}
            >
              <VerifiedBadge
                color="primary"
                verified
                badgeName="Verified Organization"
              />
              <VerifiedBadge color="greyLight" badgeName="Seeking Planter" />
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
                  info={`Organization since ${moment().format(
                    'MMMM DD, YYYY',
                  )}`}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={LocationIcon}
                  info={getLocationString(
                    organization.country_name,
                    organization.continent_name,
                  )}
                />
              </Box>
              <Box
                sx={{
                  mt: 4,
                  gap: 2,
                  display: 'flex',
                }}
              >
                <VerifiedBadge
                  color="primary"
                  verified
                  badgeName="Verified Organization"
                />
                <VerifiedBadge color="greyLight" badgeName="Seeking Planter" />
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
          <Typography variant="h4">
            Featured trees by {organization.name}
          </Typography>
          <FeaturedTreesSlider
            trees={featuredTrees.trees}
            link={(item) =>
              `/organizations/${organization.id}/trees/${item.id}`
            }
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
                text={organization?.featuredTrees?.total || '---'}
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
                text={organization?.associatedPlanters?.total || '---'}
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
                totalTrees={organization?.featuredTrees?.trees.length}
                con="af"
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
            <Box
              sx={{
                mt: [5, 10],
              }}
            >
              {organization?.species?.species?.map((s) => (
                <React.Fragment key={s.name}>
                  <TreeSpeciesCard
                    name={s.name}
                    subTitle={s.desc || '---'}
                    count={s.total}
                  />
                  <Box sx={{ mt: [2, 4] }} />
                </React.Fragment>
              ))}
            </Box>
            {(!organization?.species?.species ||
              organization?.species?.species.length === 0) && (
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
          {/* {organization?.associatedPlanters?.planters?.map((planter) => (
            <PlanterQuote
              name={planter.first_name}
              key={planter.id}
              quote={planter.about.slice(0, 150)}
              photo={planter.photo_url}
              initialDate={planter.created_time}
              location={planter.country}
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
          {organization?.associatedPlanters?.planters
            ?.sort((e1, e2) => (e1.about ? -1 : 1))
            .map((planter, i) => (
              <Box sx={{ mt: [6, 12] }} key={planter.name}>
                <PlanterQuote planter={planter} reverse={i % 2 !== 0} />
              </Box>
            ))}
        </Box>
        <Box
          sx={{
            px: [24 / 8, 24 / 4],
            mt: [80 / 8, 80 / 4],
          }}
        >
          <Divider varian="fullwidth" />
          <Typography
            sx={{
              mt: [80 / 8, 80 / 4],
            }}
            variant="h4"
          >
            About the Organization
          </Typography>
          <Typography variant="body2" mt={7}>
            <Box
              component="span"
              dangerouslySetInnerHTML={{
                __html: marked.parse(organization.about || 'NO DATA YET'),
              }}
            />
          </Typography>
          <Typography variant="h4" sx={{ mt: { xs: 10, md: 16 } }}>
            Mission
          </Typography>
          <Typography variant="body2" mt={7}>
            <Box
              component="span"
              sx={{
                fontFamily: 'Lato',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '0.04em',
              }}
              dangerouslySetInnerHTML={{
                __html: marked.parse(organization.mission || 'NO DATA YET'),
              }}
            />
          </Typography>
          <Divider
            varian="fullwidth"
            sx={{
              mt: [10, 20],
            }}
          />
          <ImpactSection />
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
            src={organization.logo_url || imagePlaceholder}
            variant="rounded"
          />
        </Portal>
      )}
    </>
  );
}

export const getServerSideProps = wrapper(async ({ params }) => {
  const id = params.organizationid;
  const organization = await getOrganizationById(id);
  const orgLinks = await getOrgLinks(organization.links);
  return {
    props: {
      organization: {
        ...organization,
        ...orgLinks,
      },
    },
  };
});
