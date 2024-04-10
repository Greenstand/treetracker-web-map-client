/* eslint-disable @next/next/no-img-element */
import CheckIcon from '@mui/icons-material/Check';
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
import { useEffect, useMemo, useState } from 'react';
import Badge from 'components/Badge';
import CustomWorldMap from 'components/CustomWorldMap';
import FeaturedTreesSlider from 'components/FeaturedTreesSlider';
import HeadTag from 'components/HeadTag';
import InformationCard1 from 'components/InformationCard1';
import ProfileAvatar from 'components/ProfileAvatar';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import Crumbs from 'components/common/Crumbs';
import CustomCard from 'components/common/CustomCard';
import Icon from 'components/common/CustomIcon';
import Info from 'components/common/Info';
import { useDrawerContext } from 'context/DrawerContext';
import { useMobile } from 'hooks/globalHooks';
import planterBackground from 'images/background.png';
import CalendarIcon from 'images/icons/calendar.svg';
import LocationIcon from 'images/icons/location.svg';
import PeopleIcon from 'images/icons/people.svg';
import TreeIcon from 'images/icons/tree.svg';
import SearchIcon from 'images/search.svg';
import { useMapContext } from 'mapContext';
import { getGrowerById, getOrgLinks } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import * as pathResolver from 'models/pathResolver';
import { getLocationString, getPlanterName, wrapper } from 'models/utils';

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

export default function Grower(props) {
  log.warn('props for grower page:', props);
  const { grower, nextExtraIsEmbed } = props;

  const { featuredTrees } = grower;
  const treeCount = featuredTrees?.total;
  const mapContext = useMapContext();
  const isMobile = useMobile();

  const router = useRouter();

  const [isGrowerTab, setIsGrowerTab] = useState(true);

  const { setTitlesData } = useDrawerContext();

  const { classes } = useStyles();

  // try to find first tree image or default image return
  const backgroundPic =
    grower?.featuredTrees?.trees?.[0]?.image_url ||
    `${router.basePath}${planterBackground}`;

  useEffect(() => {
    setTitlesData({
      firstName: grower.first_name,
      lastName: grower.last_name,
      createdTime: grower.created_time,
    });
  }, [grower.created_time, grower.first_name, grower.last_name, setTitlesData]);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && grower) {
        // map.flyTo(tree.lat, tree.lon, 16);
        await map.setFilters({
          userid: grower.id,
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
  }, [mapContext, grower]);

  const BadgeSection = useMemo(
    () => (
      <>
        <Badge
          color="primary"
          icon={<CheckIcon />}
          badgeName="Verified Grower"
        />
        <Badge color="greyLight" badgeName="Seeking Orgs" />
      </>
    ),
    [],
  );

  return (
    <>
      <HeadTag
        title={`${getPlanterName(
          grower.first_name,
          grower.last_name,
        )} - Grower`}
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
                  icon: grower.image_url,
                  name: `${getPlanterName(
                    grower.first_name,
                    grower.last_name,
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
            src={grower.image_url}
            rotation={grower.image_rotation}
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
                {getPlanterName(grower.first_name, grower.last_name)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={CalendarIcon}
                  info={
                    <>
                      Grower since
                      <time dateTime={grower?.created_at}>
                        {' '}
                        {moment(grower?.created_at).format('MMMM DD, YYYY')}
                      </time>
                    </>
                  }
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={LocationIcon}
                  info={getLocationString(
                    grower.country_name,
                    grower.continent_name,
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
            <Box sx={{}}>
              <Typography variant="h3">
                {grower.first_name}{' '}
                {grower.last_name && grower.last_name.slice(0, 1)}.
              </Typography>
            </Box>
          </Portal>
        )}
        {!isMobile && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h2">
              {grower.first_name}{' '}
              {grower.last_name && grower.last_name.slice(0, 1)}.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={
                  <>
                    Grower since
                    <time dateTime={grower?.created_at}>
                      {' '}
                      {moment(grower?.created_at).format('MMMM DD, YYYY')}
                    </time>
                  </>
                }
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={LocationIcon}
                info={getLocationString(
                  grower.country_name,
                  grower.continent_name,
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
              {BadgeSection}
            </Box>
          </Box>
        )}
        <Box
          sx={{
            mt: [8, 16],
          }}
        >
          <Typography variant="h4">
            Featured trees by {grower.first_name}
          </Typography>
          <FeaturedTreesSlider
            trees={featuredTrees.trees}
            link={(item) => `/growers/${grower.id}/trees/${item.id}`}
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
              handleClick={() => setIsGrowerTab(true)}
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
              disabled={!isGrowerTab}
            />
          </Grid>
          <Grid item sx={{ width: '49%' }}>
            <CustomCard
              handleClick={
                grower.associatedOrganizations.organizations.length
                  ? () => setIsGrowerTab(false)
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
                grower.associatedOrganizations.organizations.length || (
                  <Typography
                    variant="h5"
                    sx={{
                      minHeight: [44],
                    }}
                  >
                    Individual grower
                  </Typography>
                )
              }
              disabled={isGrowerTab}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            px: [0, 6],
            display: isGrowerTab ? 'block' : 'none',
          }}
        >
          {grower.continent_name && (
            <Box sx={{ mt: [0, 22] }}>
              <CustomWorldMap
                totalTrees={treeCount}
                con={grower.continent_name}
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
            {grower.species.species.map((species) => (
              <TreeSpeciesCard
                key={species.id}
                name={species.name}
                subTitle={species.desc || '---'}
                count={species.total}
              />
            ))}
          </Box>
          {(!grower.species.species || grower.species.species.length === 0) && (
            <Typography variant="h5">NO DATA YET</Typography>
          )}
        </Box>
        <Box
          sx={{
            px: [0, 6],
            mt: [11, 22],
            display: !isGrowerTab ? 'block' : 'none',
          }}
        >
          {grower.associatedOrganizations.organizations.map((org) => (
            <>
              <InformationCard1
                key={org.id}
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
          variant="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
        <Typography
          sx={{ mt: [2.5, 5] }}
          variant="h4"
          className={classes.textColor}
        >
          About the Grower
        </Typography>
        <Typography
          sx={{ mt: [2.5, 5] }}
          variant="body2"
          className={classes.textColor}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: marked.parse(grower.about || 'NO DATA YET'),
            }}
          />
        </Typography>
        <Divider
          variant="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
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
              transform:
                grower.image_rotation && `rotate(${grower.image_rotation}deg)`,
            }}
            src={grower.image_url}
            variant="rounded"
          />
        </Portal>
      )}
    </>
  );
}

async function serverSideData(params) {
  const id = params.growerid;
  const grower = await getGrowerById(id);
  const data = await getOrgLinks(grower.links);
  return {
    grower: { ...grower, ...data },
  };
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
