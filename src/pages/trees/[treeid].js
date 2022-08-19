/* eslint-disable @next/next/no-img-element */
import AccessTime from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HubIcon from '@mui/icons-material/Hub';
import LanguageIcon from '@mui/icons-material/Language';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme, SvgIcon, Avatar, Divider } from '@mui/material';
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
import Badges from '../../components/Badges';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Link from '../../components/Link';
import Share from '../../components/Share';
import TreeInfoDialog from '../../components/TreeInfoDialog';
import BackButton from '../../components/common/BackButton';
import TagList from '../../components/common/TagList';
import { useMobile, useEmbed } from '../../hooks/globalHooks';
import AccuracyIcon from '../../images/icons/accuracy.svg';
import CalendarIcon from '../../images/icons/calendar.svg';
import DiameterIcon from '../../images/icons/diameter.svg';
import GlobalIcon from '../../images/icons/global.svg';
import HistoryIcon from '../../images/icons/history.svg';
import LocationIcon from '../../images/icons/location.svg';
import OriginIcon from '../../images/icons/origin.svg';
import ShareIcon from '../../images/icons/share.svg';
import TokenIcon from '../../images/icons/token.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
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
  log.warn('tree: ', tree);
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const theme = useTheme();
  const router = useRouter();
  const userCameFromPlanterPage = router.asPath.includes('planters');
  const isMobile = useMobile();
  const isEmbed = useEmbed();

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

  useEffect(() => {
    setTitlesData({
      treeId: tree.id,
      verifiedToken: tree.token_id,
      verifiedTree: tree.verified,
    });
    // eslint-disable-next-line no-console, prefer-template, no-useless-concat
    console.log('the tree data' + '' + JSON.stringify(tree));
  }, [setTitlesData, tree, tree.id, tree.token_id, tree.verified]);

  useEffect(() => {
    async function draw() {
      // manipulate the map
      const { map } = mapContext;
      if (map && tree?.lat && tree?.lon) {
        map.setFilters({
          treeid: tree.id,
        });
        try {
          await map.loadInitialView();
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
      }
    }
    draw();
  }, [mapContext.map, tree.lat, tree.lon]);

  const tagListInfo = [
    {
      value: new Date(tree.time_created).toLocaleDateString(),
      error: 'no data',
      title: 'Planted on',
      icon: CalendarIcon,
    },
    {
      value: tree.verified ? 'verified' : '',
      error: 'not verified',
      title: 'Verification',
      icon: VerifiedIcon,
    },
    {
      value: tree.country_name ? tree.country_name : '',
      error: 'unknown',
      title: 'Located in',
      icon: LocationIcon,
    },
    {
      value: tree.age ? tree.age : '',
      error: 'unknown',
      title: 'Age',
      icon: HistoryIcon,
    },
    {
      value: tree.species_name ? tree.species_name : '',
      error: 'unknown',
      title: 'Species',
      icon: OriginIcon,
    },
    {
      value: tree.gps_accuracy ? tree.gps_accuracy : '',
      error: 'unknown',
      title: 'GPS Accuracy',
      icon: AccuracyIcon,
    },
    {
      value: tree.morphology ? tree.morphology : '',
      error: 'unknown',
      title: 'Morphology',
      icon: HubIcon,
    },
    {
      value: tree.lat
        ? `${shortenLongLat(tree.lat, 5)}, ${shortenLongLat(tree.lon, 5)}`
        : '',
      error: 'unknown',
      title: 'Latitude, Longitude',
      icon: GlobalIcon,
    },
    {
      value: tree.token_id ? tree.token_id : '',
      error: 'Token not issued',
      title: 'Token ID',
      icon: TokenIcon,
      subtitle: 'click to enter',
      link: tree.token_id ? `/tokens/${tree.token_id}` : '',
    },
    {
      value: tree.wallet_name ? tree.wallet_name : '',
      error: 'No wallet owns it',
      title: 'Wallet owner',
      icon: AccountBalanceWalletIcon,
    },
  ];

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
            <Typography variant="h2">Tree #{tree.id}</Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
            >
              {tree.species_name || 'Unkown species'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <Badges tokenId={tree.token_id} verified={tree.verified} />
            </Box>
          </Box>
        </Portal>
      )}
      {isMobile && (
        <Portal
          container={document.getElementById('drawer-title-container-min')}
        >
          <Box sx={{}}>
            <Typography variant="h3">Tree #{tree.id}</Typography>
          </Box>
        </Portal>
      )}

      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <BackButton
            onClick={() => {
              window.history.back();
            }}
          />
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
      {!isMobile && userCameFromPlanterPage && (
        <Link href={`/planters/${planter.id}`}>
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
        </Link>
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
          <LikeButton url={`https://map.treetracker.org/trees/${tree.id}`} />
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
                    '& svg': {
                      width: [40, 52],
                      height: [40, 52],
                    },
                  }}
                >
                  <SvgIcon
                    alt="share the link"
                    component={ShareIcon}
                    inheritViewBox
                  />
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
              Tree #{tree.id}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
              color={theme.palette.common.white}
            >
              {tree.species_name || 'Unkown species'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <Badges tokenId={tree.token_id} verified={tree.verified} />
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
            // cardImageSrc={organization?.photo_url}
            cardImageSrc={imagePlaceholder}
            link={`/organizations/${
              organization.id
            }?keyword=${nextExtraKeyword}${isEmbed ? '&embed=true' : ''}`}
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
          link={`/planters/${planter.id}?keyword=${nextExtraKeyword}${
            isEmbed ? '&embed=true' : ''
          }`}
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
      <TagList tagListInfo={tagListInfo} />
      <Divider
        varian="fullwidth"
        sx={{
          mt: [10, 20],
        }}
      />
      <ImpactSection />
      <Box height={20} />
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  const { treeid } = params;
  try {
    const tree = await getTreeById(treeid);
    const { planter_id, planting_organization_id } = tree;
    const planter = await getPlanterById(planter_id);
    let organization = null;
    if (planting_organization_id) {
      log.warn('load org from planting_orgniazation_id');
      organization = await getOrganizationById(planting_organization_id);
    } else if (planter.organzation_id) {
      log.warn('load org from planter. organization_id');
      organization = await getOrganizationById(planter.organization_id);
    }

    return {
      props: {
        tree,
        planter,
        organization,
      },
    };
  } catch (e) {
    return { notFound: true };
  }
}
