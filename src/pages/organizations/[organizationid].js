import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Avatar,
  useTheme,
} from '@mui/material';
import Portal from '@mui/material/Portal';
import log from 'loglevel';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import PlanterQuote from 'components/PlanterQuote';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import CustomImageWrapper from 'components/common/CustomImageWrapper';
import DrawerTitle from 'components/common/DrawerTitle';
import { useDrawerContext } from 'context/DrawerContext';
import { getOrganizationById, getOrgLinks } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import CustomCard from '../../components/common/CustomCard';
import Info from '../../components/common/Info';
import calendarIcon from '../../images/icons/calendar.svg';
import locationIcon from '../../images/icons/location.svg';
import peopleIcon from '../../images/icons/people.svg';
import treeIcon from '../../images/icons/tree.svg';
import orgBackground from '../../images/org-background.png';
import searchIcon from '../../images/search.svg';
// import placeholder from '../../images/organizationsPlaceholder.png';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';

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
  const { organization, nextExtraIsEmbed } = props;
  const mapContext = useMapContext();
  const { classes } = useStyles();
  const [isPlanterTab, setIsPlanterTab] = React.useState(true);
  // eslint-disable-next-line
  const [continent, setContinent] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const router = useRouter();

  const { setTitlesData } = useDrawerContext();

  async function updateContinent() {
    const tree = organization?.featuredTrees?.trees[0];
    if (tree) {
      const { lat, lon } = tree;
      const newContinent = await utils.getContinent(lat, lon);
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
        map.setFilters({
          map_name: organization.name,
        });
        // TODO why I must try/catche this?
        try {
          await map.loadInitialView();
          map.rerender();
        } catch (e) {
          log.error('rendering map:', e);
        }
      } else {
        log.warn('no data:', map, organization);
      }
    }
    reload();

    updateContinent();
    // eslint-disable-next-line
  }, [mapContext, organization]);

  return (
    <>
      <Box>
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
              <BackButton />
              <Box>
                {}
                <img src={searchIcon} alt="search" />
              </Box>
            </Box>
          )}
          <Box
            sx={{
              borderRadius: 4,
              mt: 6,
              '& img': {
                width: '100%',
              },
            }}
          >
            <img src={`${router.basePath}${orgBackground}`} alt="profile" />
            <Avatar
              src={organization.image_url}
              sx={{
                width: [120, 189],
                height: [120, 189],
                borderWidth: [4, 9],
                borderStyle: 'solid',
                borderColor: (t) => t.palette.background.paper,
                boxSizing: 'border-box',
                ml: [4, 8],
                mt: [-98 / 4, -146 / 4],
              }}
            />
          </Box>

          {!isMobile && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h2">
                {organization.first_name || '---'} {organization.last_name}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={calendarIcon}
                  info={`Organization since ${moment().format(
                    'MMMM DD, YYYY',
                  )}`}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info iconURI={locationIcon} info="Shirimatunda, Tanzania" />
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
          {!isMobile && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h2">
                {organization.first_name || '---'} {organization.last_name}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={calendarIcon}
                  info={`Organization since ${moment().format(
                    'MMMM DD, YYYY',
                  )}`}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info iconURI={locationIcon} info="Shirimatunda, Tanzania" />
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
              container={document.getElementById('drawer-title-container')}
            >
              <Box
                sx={{
                  px: 4,
                  pb: 4,
                }}
              >
                <Typography variant="h2">
                  {organization.first_name || '---'} {organization.last_name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Info
                    iconURI={calendarIcon}
                    info={`Organization since ${moment().format(
                      'MMMM DD, YYYY',
                    )}`}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Info iconURI={locationIcon} info="Shirimatunda, Tanzania" />
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
                  <VerifiedBadge
                    color="greyLight"
                    badgeName="Seeking Planter"
                  />
                </Box>
              </Box>
            </Portal>
          )}
          {isMobile && (
            <Portal
              container={document.getElementById('drawer-title-container-min')}
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
                  src={organization.image_url}
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                />
                <Typography variant="h2">
                  {organization.first_name || '---'} {organization.last_name}
                </Typography>
              </Box>
            </Portal>
          )}
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
                iconURI={treeIcon}
                title="Trees Planted"
                text={organization?.featuredTrees?.trees.length || '---'}
                disabled={!isPlanterTab}
              />
            </Grid>
            <Grid item sx={{ width: '49%' }}>
              <CustomCard
                handleClick={() => setIsPlanterTab(false)}
                iconURI={peopleIcon}
                title="Hired Planters"
                text={
                  organization?.associatedPlanters?.planters.length || '---'
                }
                disabled={isPlanterTab}
              />
            </Grid>
          </Grid>
          {isPlanterTab && (
            <Box
              sx={{
                px: [0, 6],
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
                {[].map((species) => (
                  <TreeSpeciesCard
                    key={species.id}
                    name={species.name}
                    count={species.count}
                  />
                ))}
                {/* Placeholder, remove after API fixed */}
                <TreeSpeciesCard
                  name="Baobab Tree"
                  subTitle="Adansonia"
                  count={10}
                />
                <Box sx={{ mt: [2, 4] }} />
                <TreeSpeciesCard
                  name="Wattle Tree"
                  subTitle="Acacia sensu lato"
                  count={2}
                />
              </Box>
            </Box>
          )}
        </Box>

        {!isPlanterTab && (
          <Box
            sx={{
              mt: [11, 22],
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
            {[
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
            ].map((planter, i) => (
              <Box sx={{ mt: [6, 12] }} key={planter.name}>
                <PlanterQuote {...planter} reverse={i % 2 !== 0} />
              </Box>
            ))}
          </Box>
        )}
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
            {/* Just some placeholder text */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
            nesciunt quasi praesentium non cupiditate ratione nihil.
            Perferendis, velit ipsa illo, odit unde atque doloribus tempora
            distinctio facere dolorem expedita error. Natus, provident. Tempore
            harum repellendus reprehenderit vitae temporibus, consequuntur
            blanditiis officia excepturi, natus explicabo laborum delectus
            repudiandae placeat eligendi.
          </Typography>
          <Typography variant="h4" sx={{ mt: { xs: 10, md: 16 } }}>
            Mission
          </Typography>
          <Typography variant="body2" mt={7}>
            {/* Just some placeholder text */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
            nesciunt quasi praesentium non cupiditate ratione nihil.
            Perferendis, velit ipsa illo, odit unde atque doloribus tempora
            distinctio facere dolorem expedita error. Natus, provident. Tempore
            harum repellendus reprehenderit vitae temporibus, consequuntur
            blanditiis officia excepturi, natus explicabo laborum delectus
            repudiandae placeat eligendi.
          </Typography>
          <Box sx={{ height: 80 }} />
        </Box>
      </Box>
      {nextExtraIsEmbed && (
        <Portal container={document.getElementById('embed-logo-container')}>
          <Avatar
            sx={{
              width: '120px',
              height: '120px',
              margin: '10px',
            }}
            src={organization.image_url}
            variant="rounded"
          />
        </Portal>
      )}
    </>
  );
}

export async function getStaticProps({ params }) {
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
    revalidate: Number(process.env.NEXT_CACHE_REVALIDATION_OVERRIDE) || 30,
  };
}

// eslint-disable-next-line require-await
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
