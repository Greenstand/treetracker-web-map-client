/* eslint-disable @next/next/no-img-element */
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { SvgIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import CustomImageWrapper from 'components/common/CustomImageWrapper';
import { getPlanterById, getOrgLinks } from 'models/api';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import CustomCard from '../../components/common/CustomCard';
import DataTag from '../../components/common/DataTag';
import DrawerTitle from '../../components/common/DrawerTitle';
import Info from '../../components/common/Info';
import { useDrawerContext } from '../../context/DrawerContext';
import { useMobile } from '../../hooks/globalHooks';
import planterBackground from '../../images/background.png';
import CalendarIcon from '../../images/icons/calendar.svg';
import LocationIcon from '../../images/icons/location.svg';
import PeopleIcon from '../../images/icons/people.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';
import { makeStyles } from '../../models/makeStyles';
import * as utils from '../../models/utils';

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
        try {
          if (router.query.bounds) {
            await map.goToBounds(router.query.bounds);
          } else {
            map.setFilters({
              userid: planter.id,
            });
            await map.loadInitialView();
          }
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
        log.warn('no data:', map, planter);
      }
    }
    reload();
  }, [mapContext, planter, router]);

  return (
    <>
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
            <BackButton />
            <Box>
              {}
              <SvgIcon
                component={SearchIcon}
                inheritViewBox
                sx={{
                  width: 48,
                  height: 48,
                  fill: 'transparent',
                  '& path': {
                    fill: 'grey',
                  },
                  '& rect': {
                    stroke: 'grey',
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

          <Avatar
            src={planter.image_url}
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

        {isMobile && (
          <Portal container={document.getElementById('drawer-title-container')}>
            <Box
              sx={{
                px: 4,
                pb: 4,
              }}
            >
              <Typography variant="h2">
                {utils.getPlanterName(planter.first_name, planter.last_name)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={CalendarIcon}
                  info={`Planter since ${moment().format('MMMM DD, YYYY')}`}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Info iconURI={LocationIcon} info="Shirimatunda, Tanzania" />
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
            container={document.getElementById('drawer-title-container-min')}
          >
            <Box sx={{}}>
              <Typography variant="h2">
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
                info={`Planter since ${moment().format('MMMM DD, YYYY')}`}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Info iconURI={LocationIcon} info="Shirimatunda, Tanzania" />
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
              sx={{ height: 34, width: 26 }}
              title="Trees Planted"
              text={treeCount}
              disabled={!isPlanterTab}
            />
          </Grid>
          <Grid item sx={{ width: '49%' }}>
            <CustomCard
              handleClick={() => setIsPlanterTab(false)}
              iconURI={PeopleIcon}
              sx={{ height: 36, width: 36 }}
              title="Ass. Orgs"
              text={
                planter.associatedOrganizations.organizations.length || '---'
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
                  count={species.count}
                />
              ))}
              {/* Placeholder, remove after API fixed */}
              <TreeSpeciesCard
                name="Baobab Tree"
                subTitle="Adansonia"
                count={10}
              />
              <TreeSpeciesCard
                name="Wattle Tree"
                subTitle="Acacia sensu lato"
                count={2}
              />
            </Box>
          </Box>
        )}
        {!isPlanterTab && (
          <Box
            sx={{
              px: [0, 6],
              mt: [11, 22],
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
        )}
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
          {placeholderText}
          {planter.about}
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
        <Portal container={document.getElementById('embed-logo-container')}>
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

export async function getServerSideProps({ params }) {
  const id = params.planterid;
  try {
    const planter = await getPlanterById(id);
    const data = await getOrgLinks(planter.links);
    return {
      props: {
        planter: { ...planter, ...data },
      },
    };
  } catch (e) {
    return { notFound: true };
  }
}
