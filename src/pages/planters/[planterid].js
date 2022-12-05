/* eslint-disable @next/next/no-img-element */
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import { marked } from 'marked';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import FeaturedTreesSlider from 'components/FeaturedTreesSlider';
import HeadTag from 'components/HeadTag';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import { getPlanterById, getOrgLinks } from 'models/api';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import ProfileAvatar from '../../components/ProfileAvatar';
import VerifiedBadge from '../../components/VerifiedBadge';
import Crumbs from '../../components/common/Crumbs';
import CustomCard from '../../components/common/CustomCard';
import Icon from '../../components/common/CustomIcon';
import Info from '../../components/common/Info';
import { useDrawerContext } from '../../context/DrawerContext';
import { useMobile } from '../../hooks/globalHooks';
import planterBackground from '../../images/background.png';
import CalendarIcon from '../../images/icons/calendar.svg';
import LocationIcon from '../../images/icons/location.svg';
import PeopleIcon from '../../images/icons/people.svg';
import TreeIcon from '../../images/icons/tree.svg';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';
import { makeStyles } from '../../models/makeStyles';
import * as pathResolver from '../../models/pathResolver';
import { getLocationString, getPlanterName, wrapper } from '../../models/utils';

// make styles for component with material-ui
const useStyles = makeStyles()((theme) => ({
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  treeSlider: {
    marginTop: theme.spacing(10),
  },
  divider: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(14),
      marginBottom: theme.spacing(14),
    },
  },
  profileImg: {
    maxHeight: '764px',
    borderRadius: '16px',
    [theme.breakpoints.down('md')]: {
      height: '332px',
    },
  },
}));

const placeholderText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
        nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
        velit ipsa illo, odit unde atque doloribus tempora distinctio facere
        dolorem expedita error. Natus, provident. Tempore harum repellendus
        reprehenderit vitae temporibus, consequuntur blanditiis officia
        excepturi, natus explicabo laborum delectus repudiandae placeat
        eligendi.`;
export default function Planter(props) {
  log.warn('props for planter page:', props);
  const { planter, nextExtraIsEmbed } = props;
  const { featuredTrees } = planter;
  const treeCount = featuredTrees.trees.length;
  const mapContext = useMapContext();
  const isMobile = useMobile();

  const router = useRouter();

  const [isPlanterTab, setIsPlanterTab] = useState(true);

  const { setTitlesData } = useDrawerContext();

  const { classes } = useStyles();

  // try to find first tree image or default image return
  const backgroundPic =
    planter?.featuredTrees?.trees?.[0]?.image_url ||
    `${router.basePath}${planterBackground}`;

  useEffect(() => {
    setTitlesData({
      firstName: planter.first_name,
      lastName: planter.last_name,
      createdTime: planter.created_time,
    });
  }, [
    planter.created_time,
    planter.first_name,
    planter.last_name,
    setTitlesData,
  ]);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && planter) {
        // map.flyTo(tree.lat, tree.lon, 16);
        await map.setFilters({
          userid: planter.id,
        });
        const bounds = pathResolver.getBounds(router);
        if (bounds) {
          log.warn('goto bounds found in url');
          await map.gotoBounds(bounds);
        } else {
          const view = await map.getInitialView();
          map.gotoView(view.center.lat, view.center.lon, view.zoomLevel);
        }
      }
    }
    reload();
  }, [mapContext, planter]);

  return (
    <>
      <HeadTag
        title={`${getPlanterName(
          planter.first_name,
          planter.last_name,
        )} - Planter`}
      />
      <Box
        sx={[
          {
            padding: (t) => [t.spacing(0, 4), 6],
            width: 1,
            boxSizing: 'border-box',
          },
          nextExtraIsEmbed && {
            padding: (t) => [t.spacing(0, 4), 4],
          },
        ]}
      >
        {/* <IsMobileScreen>
          <DrawerTitle />
        </IsMobileScreen> */}
        {/* <IsMobileScreen>
          <Divider variant="fullWidth" sx={{ mt: 7, mb: 13.75 }} />
        </IsMobileScreen> */}
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
                  icon: planter.image_url,
                  name: `${getPlanterName(
                    planter.first_name,
                    planter.last_name,
                  )}`,
                },
              ]}
            />
            <Box>
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
          </Box>
        )}

        <Box
          sx={{
            borderRadius: 4,
            mt: 6,
            '& img': {
              width: '100%',
              borderRadius: '16px',
              maxHeight: [212, 328],
              objectFit: 'cover',
            },
          }}
        >
          <img src={backgroundPic} alt="profile" />
          <ProfileAvatar
            src={planter.image_url}
            rotation={planter.image_rotation}
          />
        </Box>

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
              <Typography variant="h2">
                {getPlanterName(planter.first_name, planter.last_name)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={CalendarIcon}
                  info={`Planter since ${moment(planter.created_at).format(
                    'MMMM DD, YYYY',
                  )}`}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={LocationIcon}
                  info={getLocationString(
                    planter.country_name,
                    planter.continent_name,
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
                  badgeName="Verified Planter"
                />
                <VerifiedBadge color="greyLight" badgeName="Seeking Orgs" />
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
            <Box sx={{}}>
              <Typography variant="h3">
                {planter.first_name}{' '}
                {planter.last_name && planter.last_name.slice(0, 1)}.
              </Typography>
            </Box>
          </Portal>
        )}

        {!isMobile && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h2">
              {planter.first_name}{' '}
              {planter.last_name && planter.last_name.slice(0, 1)}.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={`Planter since ${moment(planter.created_at).format(
                  'MMMM DD, YYYY',
                )}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(
                  planter.country_name,
                  planter.continent_name,
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
                badgeName="Verified Planter"
              />
              <VerifiedBadge color="greyLight" badgeName="Seeking Orgs" />
            </Box>
          </Box>
        )}

        <Box
          sx={{
            mt: [8, 16],
          }}
        >
          <Typography variant="h4">
            Featured trees by {planter.first_name}
          </Typography>
          <FeaturedTreesSlider
            trees={featuredTrees.trees}
            link={(item) => `/planters/${planter.id}/trees/${item.id}`}
          />
        </Box>

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
              title="Trees Planted"
              text={treeCount}
              disabled={!isPlanterTab}
            />
          </Grid>
          <Grid item sx={{ width: '49%' }}>
            <CustomCard
              handleClick={
                planter.associatedOrganizations.organizations.length
                  ? () => setIsPlanterTab(false)
                  : undefined
              }
              iconURI={PeopleIcon}
              iconProps={{
                sx: {
                  '& path': {
                    fill: ({ palette }) => palette.text.primary,
                  },
                },
              }}
              title="Associated Orgs"
              text={
                planter.associatedOrganizations.organizations.length || (
                  <Typography
                    variant="h5"
                    sx={{
                      minHeight: [44],
                    }}
                  >
                    Individual planter
                  </Typography>
                )
              }
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
          {planter.continent_name && (
            <Box sx={{ mt: [0, 22] }}>
              <CustomWorldMap
                totalTrees={treeCount}
                con={planter.continent_name}
              />
            </Box>
          )}

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
            {planter.species.species.map((species) => (
              <TreeSpeciesCard
                key={species.id}
                name={species.name}
                subTitle={species.desc || '---'}
                count={species.total}
              />
            ))}
          </Box>
          {(!planter.species.species ||
            planter.species.species.length === 0) && (
            <Typography variant="h5">NO DATA YET</Typography>
          )}
        </Box>
        <Box
          sx={{
            px: [0, 6],
            mt: [11, 22],
            display: !isPlanterTab ? 'block' : 'none',
          }}
        >
          {planter.associatedOrganizations.organizations.map((org) => (
            <>
              <InformationCard1
                entityName={org.name}
                entityType="Planting Organization"
                buttonText="Meet the Organization"
                link={`/organizations/${org.id}`}
                cardImageSrc={org?.logo_url}
              />
              <Box sx={{ mt: [6, 12] }} />
            </>
          ))}
        </Box>
        <Divider
          varian="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
        <Typography
          sx={{ mt: [2.5, 5] }}
          variant="h4"
          className={classes.textColor}
        >
          About the Planter
        </Typography>
        <Typography
          sx={{ mt: [2.5, 5] }}
          variant="body2"
          className={classes.textColor}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: marked.parse(planter.about || 'NO DATA YET'),
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
        <Box sx={{ height: 40 }} />
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
            src={planter.image_url}
            variant="rounded"
          />
        </Portal>
      )}
    </>
  );
}

export const getServerSideProps = wrapper(async ({ params }) => {
  const id = params.planterid;
  const planter = await getPlanterById(id);
  const data = await getOrgLinks(planter.links);
  return {
    props: {
      planter: { ...planter, ...data },
    },
  };
});
