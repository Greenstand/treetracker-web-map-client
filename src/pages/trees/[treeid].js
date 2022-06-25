/* eslint-disable @next/next/no-img-element */
import AccessTime from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LanguageIcon from '@mui/icons-material/Language';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { useMediaQuery, useTheme, SvgIcon, Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CustomImageWrapper from 'components/common/CustomImageWrapper';
import { useDrawerContext } from 'context/DrawerContext';
import { getOrganizationById, getPlanterById, getTreeById } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Share from '../../components/Share';
import TreeInfoDialog from '../../components/TreeInfoDialog';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import TreeTag from '../../components/common/TreeTag';
import accuracyIcon from '../../images/icons/accuracy.svg';
import calendarIcon from '../../images/icons/calendar.svg';
import globalIcon from '../../images/icons/global.svg';
import historyIcon from '../../images/icons/history.svg';
import location from '../../images/icons/location.svg';
import shareIcon from '../../images/icons/share.svg';
import tokenIcon from '../../images/icons/token.svg';
import searchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';

const useStyles = makeStyles()((theme) => ({
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabBox: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(5),
    },
    flexWrap: 'wrap',
    display: 'flex',
    gap: 16,
    // '& div': {
    //   margin: theme.spacing(2),
    //   [theme.breakpoints.down('md')]: {
    //     marginTop: theme.spacing(1),
    //   },
    // },
  },
}));

export default function Tree({
  tree,
  planter,
  organization,
  nextExtraIsEmbed,
  nextExtraKeyword,
}) {
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const userCameFromPlanterPage = router.asPath.includes('planters');

  const { setTitlesData } = useDrawerContext();

  log.warn('map:', mapContext);

  function handleShare() {}

  // shorten tree.lat, tree.lon down to 5 decimal points
  function shortenLongLat(number, digits) {
    const multiplier = 10 ** digits;
    const numAdjust = number * multiplier;
    const shortenNum = Math[numAdjust < 0 ? 'ceil' : 'floor'](numAdjust);

    return shortenNum / multiplier;
  }

  function handleMax(url) {
    window.open(url, '_blank');
  }

  useEffect(() => {
    setTitlesData({
      treeId: tree.id,
      verifiedToken: tree.token_id,
      verifiedTree: tree.verified,
    });
  }, [setTitlesData, tree.id, tree.token_id, tree.verified]);

  useEffect(() => {
    // manipulate the map
    if (mapContext.map && tree?.lat && tree?.lon) {
      mapContext.map.flyTo(tree.lat, tree.lon, 16);
    }
  }, [mapContext.map, tree.lat, tree.lon]);

  return (
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
      {isMobile && (
        <Portal container={document.getElementById('drawer-title-container')}>
          <Box
            sx={{
              width: 1,
              px: 4,
              pb: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h2">Tree - #{tree.id}</Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
            >
              Palm tree
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <VerifiedBadge
                color="primary"
                verified
                badgeName="Verified Planter"
              />
              <VerifiedBadge color="secondary" badgeName="Token Issued" />
            </Box>
          </Box>
        </Portal>
      )}
      {isMobile && (
        <Portal
          container={document.getElementById('drawer-title-container-min')}
        >
          <Box sx={{}}>
            <Typography variant="h2">Tree - #{tree.id}</Typography>
          </Box>
        </Portal>
      )}
      {!isMobile && userCameFromPlanterPage && (
        <>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Avatar className={classes.media} src={planter.image_url} />
            <Box sx={{ marginLeft: 3 }}>
              <Typography variant="h5">
                {planter.first_name} {planter.last_name}
              </Typography>
            </Box>
          </Box>

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
        </>
      )}
      <Box
        sx={[
          {
            borderRadius: 4,
            maxHeight: [332, 764],
            mt: 6,
            position: 'relative',
            overflow: 'hidden',
            '& img': {
              width: '100%',
            },
          },
          nextExtraIsEmbed && {
            '& img': {
              maxHeight: 600,
              objectFit: 'cover',
            },
          },
        ]}
      >
        <Box
          sx={{
            position: 'absolute',
            // top: [4, 6],
            // left: [4, 6],
            pt: [4, 6],
            px: [4, 6],
            width: 1,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <LikeButton treeId={tree.id} />
          <Box
            sx={{
              display: 'flex',
              gap: [4, 6],
              flexDirection: 'row',
            }}
          >
            <Share
              shareUrl={typeof window !== 'undefined' && window.location.href}
              icon={
                <Box
                  onClick={handleShare}
                  sx={{
                    cursor: 'pointer',
                    '& img': {
                      width: [40, 52],
                      height: [40, 52],
                    },
                  }}
                >
                  <img alt="share the link" src={shareIcon} />
                </Box>
              }
            />
            <TreeInfoDialog
              tree={tree}
              planter={planter}
              organization={organization}
            />
          </Box>
        </Box>
        <img src={tree.image_url} alt="tree" />
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              background:
                'linear-gradient(359.38deg, #222629 0.49%, rgba(34, 38, 41, 0.8) 37.89%, rgba(34, 38, 41, 0.7) 50.17%, rgba(34, 38, 41, 0.6) 58.09%, rgba(34, 38, 41, 0.2) 82.64%, rgba(34, 38, 41, 0.05) 92.94%, rgba(34, 38, 41, 0) 99.42%)',
              p: 6,
              width: 1,
              height: 260,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h2" color={theme.palette.common.white}>
              Tree - #{tree.id}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
              color={theme.palette.common.white}
            >
              Palm tree
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <VerifiedBadge
                color="primary"
                verified
                badgeName="Verified Planter"
              />
              <VerifiedBadge color="secondary" badgeName="Token Issued" />
            </Box>
          </Box>
        )}
      </Box>
      {/* <CustomImageWrapper
        imageUrl={tree.image_url}
        timeCreated={tree.time_created}
        treeId={tree.id}
      /> */}
      {organization && (
        <Box
          sx={[
            {
              mt: [6, 14],
            },
            nextExtraIsEmbed && {
              mt: [6, 10],
            },
          ]}
        >
          <InformationCard1
            entityName={organization.name}
            entityType="Planting Organization"
            buttonText="Meet the Organization"
            cardImageSrc={organization?.photo_url}
            link={`/organizations/${organization.id}?embed=${nextExtraIsEmbed}&keyword=${nextExtraKeyword}`}
          />
        </Box>
      )}
      <Box
        sx={{
          mt: [4, 10],
        }}
      >
        <InformationCard1
          entityName={`${planter.first_name} ${planter.last_name}`}
          entityType="Planter"
          buttonText="Meet the Planter"
          cardImageSrc={planter?.image_url}
          link={`/planters/${planter.id}?embed=${nextExtraIsEmbed}&keyword=${nextExtraKeyword}`}
        />
      </Box>
      <Typography
        variant="h4"
        sx={[
          {
            fontSize: [24, 28],
            lineHeight: (t) => [t.spacing(7.25), t.spacing(8.5)],
            mt: (t) => [t.spacing(14), t.spacing(26)],
          },
          nextExtraIsEmbed && {
            mt: (t) => [t.spacing(14), t.spacing(26 * 0.6)],
          },
        ]}
      >
        Tree Info
      </Typography>
      <Box className={classes.tabBox}>
        <TreeTag
          TreeTagValue={new Date(tree.time_created).toLocaleDateString()}
          title="Planted on"
          icon={<img src={calendarIcon} alt="calendar" />}
        />
        <TreeTag
          TreeTagValue="Tanzania"
          title="Located in"
          icon={<img src={location} alt="location" />}
        />
        {tree.age && (
          <TreeTag
            TreeTagValue={tree.age}
            title="Age"
            icon={<img src={historyIcon} alt="age" />}
          />
        )}
        {tree.gps_accuracy && (
          <TreeTag
            TreeTagValue={tree.gps_accuracy}
            title="GPS Accuracy"
            icon={<img src={accuracyIcon} alt="accuracy" />}
          />
        )}
        {tree.lat && tree.lon && (
          <TreeTag
            TreeTagValue={`${shortenLongLat(tree.lat, 5)}, ${shortenLongLat(
              tree.lon,
              5,
            )}`}
            title="Latitude, Longitude"
            icon={<img src={globalIcon} alt="lat,lon" />}
          />
        )}
        {tree.token_id && (
          <TreeTag
            TreeTagValue={tree.token_id}
            title="Token ID"
            icon={<img src={tokenIcon} alt="token" />}
          />
        )}
      </Box>
      <Box height={20} />
    </Box>
  );
}

export async function getStaticProps({ params }) {
  const { treeid } = params;
  const tree = await getTreeById(treeid);
  const { planter_id, planting_organization_id } = tree;
  const planter = await getPlanterById(planter_id);
  let organization = null;
  if (planting_organization_id) {
    organization = await getOrganizationById(planting_organization_id);
  }

  return {
    props: {
      tree,
      planter,
      organization,
    },
    revalidate: Number(process.env.NEXT_CACHE_REVALIDATION_OVERRIDE) || 180,
  };
}

// eslint-disable-next-line require-await
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
