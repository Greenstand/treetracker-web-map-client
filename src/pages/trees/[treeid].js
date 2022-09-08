/* eslint-disable @next/next/no-img-element */
import AccessTime from '@mui/icons-material/AccessTime';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
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
import Crumbs from '../../components/common/Crumbs';
import TreeTag from '../../components/common/TreeTag';
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
import * as pathResolver from '../../models/pathResolver';
import * as utils from '../../models/utils';

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
  const { map } = mapContext;
  const theme = useTheme();
  const router = useRouter();
  const context = pathResolver.getContext(router.asPath);
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

  // useEffect(() => {
  //   async function draw() {
  //     // manipulate the map
  //     const { map } = mapContext;
  //     if (map && tree?.lat && tree?.lon) {
  //       map.setFilters({
  //         treeid: tree.id,
  //       });
  //       try {
  //         await map.loadInitialView();
  //       } catch (err) {
  //         log.warn('error:', err);
  //       }
  //       map.rerender();
  //     }
  //   }
  //   draw();
  // }, [mapContext.map, tree.lat, tree.lon]);
  useEffect(() => {
    async function reload() {
      // manipulate the map
      log.warn('map ,tree, context in tree page:', map, tree, context);
      if (map && tree?.lat && tree?.lon) {
        if (context && context.name) {
          if (context.name === 'planters') {
            log.warn('set planter filter', context.id);
            await map.setFilters({
              userid: context.id,
            });
            await map.gotoView(
              parseFloat(tree.lat.toString()),
              parseFloat(tree.lon.toString()),
              16,
            );
            const treeDataForMap = {
              ...tree,
              lat: parseFloat(tree.lat.toString()),
              lon: parseFloat(tree.lon.toString()),
            };
            map.selectTree(treeDataForMap);
          } else if (context.name === 'organizations') {
            log.warn('set org filter', organization.map_name);
            await map.setFilters({
              map_name: organization.map_name,
            });
            await map.gotoView(
              parseFloat(tree.lat.toString()),
              parseFloat(tree.lon.toString()),
              16,
            );
            const treeDataForMap = {
              ...tree,
              lat: parseFloat(tree.lat.toString()),
              lon: parseFloat(tree.lon.toString()),
            };
            map.selectTree(treeDataForMap);
          } else {
            throw new Error(`unknown context name: ${context.name}`);
          }
        } else {
          log.warn('set treeid filter', tree.id);
          await map.setFilters({
            treeid: tree.id,
          });
          await map.gotoView(
            parseFloat(tree.lat.toString()),
            parseFloat(tree.lon.toString()),
            16,
          );
        }

        // // select the tree
        // const treeDataForMap = {
        //   ...tree,
        //   lat: parseFloat(tree.lat.toString()),
        //   lon: parseFloat(tree.lon.toString()),
        // };
        // mapContext.map.selectTree(treeDataForMap);
        // // log.warn('filter of map:', mapContext.map.getFilters());
      }
    }
    reload();
  }, [map, tree.lat, tree.lon]);

  const tags = [];
  const tagsTail = [];
  tags.push(
    <TreeTag
      key="planted-on"
      TreeTagValue={new Date(tree.time_created).toLocaleDateString()}
      title="Planted on"
      icon={<SvgIcon component={CalendarIcon} />}
    />,
  );

  if (tree.verified) {
    tags.push(
      <TreeTag
        key="verification"
        TreeTagValue="verifed"
        title="Verification"
        icon={<SvgIcon component={VerifiedIcon} />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="located-in"
        TreeTagValue="not verified"
        title="Verification"
        icon={<SvgIcon component={VerifiedIcon} />}
        disabled
      />,
    );
  }

  if (tree.country_name) {
    tags.push(
      <TreeTag
        key="located-in"
        TreeTagValue={tree.country_name}
        title="Located in"
        icon={<SvgIcon component={LocationIcon} />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="located-in"
        TreeTagValue="unknown"
        title="Located in"
        icon={<SvgIcon component={LocationIcon} />}
        disabled
      />,
    );
  }

  if (tree.age) {
    tags.push(
      <TreeTag
        key="Age"
        TreeTagValue={tree.age}
        title="Age"
        icon={<SvgIcon component={HistoryIcon} />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="Age"
        TreeTagValue="unknown"
        title="Age"
        icon={<SvgIcon component={HistoryIcon} />}
        disabled
      />,
    );
  }
  if (tree.species_name) {
    tags.push(
      <TreeTag
        key="species"
        TreeTagValue={tree.species_name}
        title="Species"
        icon={<SvgIcon component={OriginIcon} inheritViewBox alt="origin" />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="species"
        TreeTagValue="unknown"
        title="Species"
        icon={<SvgIcon component={OriginIcon} inheritViewBox alt="origin" />}
        disabled
      />,
    );
  }

  if (tree.gps_accuracy) {
    tags.push(
      <TreeTag
        key="gps-accuracy"
        TreeTagValue={tree.gps_accuracy}
        title="GPS Accuracy"
        icon={<SvgIcon component={AccuracyIcon} />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="gps-accuracy"
        TreeTagValue="unknown"
        title="GPS Accuracy"
        icon={<SvgIcon component={AccuracyIcon} />}
        disabled
      />,
    );
  }

  if (tree.morphology) {
    tags.push(
      <TreeTag
        key="morphology"
        TreeTagValue={tree.morphology}
        title="Morphology"
        icon={<SvgIcon component={HubIcon} />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="morphology"
        TreeTagValue="unknown"
        title="Morphology"
        icon={<SvgIcon component={HubIcon} />}
        disabled
      />,
    );
  }

  if (tree.lat && tree.lon) {
    tags.push(
      <TreeTag
        key="latitude-longitude"
        TreeTagValue={`${shortenLongLat(tree.lat, 5)}, ${shortenLongLat(
          tree.lon,
          5,
        )}`}
        title="Latitude, Longitude"
        icon={<SvgIcon component={GlobalIcon} color="pink" />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="latitude-longitude"
        TreeTagValue="unknown"
        title="Latitude, Longitude"
        icon={<SvgIcon component={GlobalIcon} color="pink" />}
        disabled
      />,
    );
  }
  if (tree.token_id) {
    tags.push(
      <TreeTag
        key="token-id"
        TreeTagValue={tree.token_id}
        title="Token ID"
        icon={<SvgIcon component={TokenIcon} />}
        subtitle="click to enter"
        link={`/tokens/${tree.token_id}`}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="token-id"
        TreeTagValue="Token not issued"
        title="Token ID"
        icon={<SvgIcon component={TokenIcon} />}
        disabled
      />,
    );
  }
  if (tree.wallet_name) {
    tags.push(
      <TreeTag
        key="wallet"
        TreeTagValue={tree.wallet_name}
        title="Wallet ownner"
        icon={<SvgIcon component={AccountBalanceWalletIcon} />}
        subtitle="click to enter"
        link={`/wallets/${tree.wallet_id}`}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="wallet"
        TreeTagValue="No wallet owns it"
        title="Wallet owner"
        icon={<SvgIcon component={AccountBalanceWalletIcon} />}
        disabled
      />,
    );
  }

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
          <Crumbs
            items={[
              {
                // icon: <HomeIcon />,
                name: 'Home',
                url: '/',
              },
              ...(context && context.name === 'planters'
                ? [
                    {
                      url: `/planters/${planter.id}`,
                      icon: planter.image_url,
                      name: `${utils.getPlanterName(
                        planter.first_name,
                        planter.last_name,
                      )}`,
                    },
                  ]
                : []),
              ...(context && context.name === 'organizations'
                ? [
                    {
                      url: `/organizations/${organization.id}`,
                      icon: organization.logo_url,
                      name: organization.name,
                    },
                  ]
                : []),
              {
                name: `tree #${tree.id}`,
              },
            ]}
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
            cardImageSrc={organization?.photo_url && imagePlaceholder}
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
      <Box className={classes.tabBox}>
        {tags}
        {tagsTail}
      </Box>
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
