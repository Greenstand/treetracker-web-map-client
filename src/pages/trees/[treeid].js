/* eslint-disable @next/next/no-img-element */
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HubIcon from '@mui/icons-material/Hub';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme, Avatar, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HeadTag from 'components/HeadTag';
import TagList from 'components/common/TagList';
import { useDrawerContext } from 'context/DrawerContext';
import { getOrganizationById, getPlanterById, getTreeById } from 'models/api';
import Badges from '../../components/Badges';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Share from '../../components/Share';
import TreeInfoDialog from '../../components/TreeInfoDialog';
import Crumbs from '../../components/common/Crumbs';
import Icon from '../../components/common/CustomIcon';
import TreeTag from '../../components/common/TreeTag';
import { useMobile, useEmbed } from '../../hooks/globalHooks';
import AccuracyIcon from '../../images/icons/accuracy.svg';
import CalendarIcon from '../../images/icons/calendar.svg';
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

export default function Tree({
  tree,
  planter,
  organization,
  nextExtraIsEmbed,
  nextExtraKeyword,
}) {
  log.warn('tree: ', tree);
  const mapContext = useMapContext();
  const { map } = mapContext;
  const theme = useTheme();
  const router = useRouter();
  const context = pathResolver.getContext(router, {
    base: process.env.NEXT_PUBLIC_BASE,
  });
  const isMobile = useMobile();
  const isEmbed = useEmbed();
  const isPlanterContext = context && context.name === 'planters';
  const isOrganizationContext = context && context.name === 'organizations';

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
    // eslint-disable-next-line prefer-template, no-useless-concat
    log.warn('the tree data' + '' + JSON.stringify(tree));
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
      async function focusTree(map2, tree2) {
        const currentView = map2.getCurrentView();
        log.warn('current view:', currentView);
        if (currentView.zoomLevel < 16) {
          log.warn('focus the tree:', tree2);
          await map2.gotoView(
            parseFloat(tree2.lat.toString()),
            parseFloat(tree2.lon.toString()),
            16,
          );
        } else {
          log.warn('stay on the map zoom');
        }
      }
      // manipulate the map
      log.warn('map ,tree, context in tree page:', map, tree, context);
      if (map && tree?.lat && tree?.lon) {
        if (context && context.name) {
          if (isPlanterContext) {
            log.warn('set planter filter', context.id);
            await map.setFilters({
              userid: context.id,
            });
            await focusTree(map, tree);
            const treeDataForMap = {
              ...tree,
              lat: parseFloat(tree.lat.toString()),
              lon: parseFloat(tree.lon.toString()),
            };
            map.selectTree(treeDataForMap);
          } else if (isOrganizationContext) {
            log.warn('set org filter', organization.map_name);
            await map.setFilters({
              map_name: organization.map_name,
            });
            await focusTree(map, tree);
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
          await map.setFilters({});
          await focusTree(map, tree);
          const treeDataForMap = {
            ...tree,
            lat: parseFloat(tree.lat.toString()),
            lon: parseFloat(tree.lon.toString()),
          };
          map.selectTree(treeDataForMap);
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

  log.warn(planter, 'planter');

  return (
    <>
      <HeadTag title={`Tree #${tree.id}`} />
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
          <Portal
            container={() => document.getElementById('drawer-title-container')}
          >
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
              <Box
                sx={{
                  mt: 2,
                  color: theme.palette.common.black,
                  filter: 'opacity(0.8)',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.black },
                  }}
                >
                  <Icon icon={OriginIcon} />
                  {tree.species_name || 'Unknown Species'}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.black },
                  }}
                >
                  <Icon icon={CalendarIcon} />
                  {`Planted on ${moment(tree.time_created).format(
                    'MMMM Do, YYYY',
                  )}` || 'Unknown Date'}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.black },
                  }}
                >
                  <Icon icon={LocationIcon} />
                  {tree.country_name !== null
                    ? `Located in ${tree.country_name}`
                    : 'Unknown location'}
                </Typography>
              </Box>
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
            container={() =>
              document.getElementById('drawer-title-container-min')
            }
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
                ...(isPlanterContext
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
                ...(isOrganizationContext && organization
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
              <Icon
                icon={SearchIcon}
                width={48}
                height={48}
                sx={{
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
                    <Icon icon={ShareIcon} />
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

              <Box
                sx={{
                  mt: 2,
                  color: theme.palette.common.white,
                  filter: 'opacity(0.8)',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.white },
                  }}
                >
                  <Icon icon={OriginIcon} />
                  {tree.species_name || 'Unknown Species'}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.white },
                  }}
                >
                  <Icon icon={CalendarIcon} />
                  {`Planted on ${moment(tree.time_created).format(
                    'MMMM Do, YYYY',
                  )}` || 'Unknown Date'}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    '& svg': {
                      filter: 'opacity(0.8)',
                      maxWidth: 16,
                      maxHeight: 16,
                    },
                    '& path': { fill: theme.palette.common.white },
                  }}
                >
                  <Icon icon={LocationIcon} />
                  {tree.country_name !== null
                    ? `Located in ${tree.country_name}`
                    : 'Unknown location'}
                </Typography>
              </Box>
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
            rotation={planter?.image_rotation}
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
        <TagList>
          <TreeTag
            TreeTagValue={new Date(tree.time_created).toLocaleDateString()}
            title="Planted on"
            icon={<Icon icon={CalendarIcon} />}
          />
          <TreeTag
            TreeTagValue={tree.verified === false ? 'not verified' : 'verifed'}
            title="Verification"
            icon={<Icon icon={VerifiedIcon} />}
            disabled={tree.verified === false}
          />
          <TreeTag
            TreeTagValue={
              tree.country_name === null ? 'unknown' : tree.country_name
            }
            title="Located in"
            icon={<Icon icon={LocationIcon} />}
            disabled={tree.country_name === null}
          />
          <TreeTag
            TreeTagValue={tree.age === null ? 'unknown' : tree.age}
            title="Age"
            icon={<Icon icon={HistoryIcon} />}
            disabled={tree.age === null}
          />
          <TreeTag
            TreeTagValue={
              tree.species_name === null ? 'unknown' : tree.species_name
            }
            title="Species"
            icon={<Icon icon={OriginIcon} />}
            disabled={tree.species_name === null}
            subtitle={tree.species_desc === null ? null : 'click to learn more'}
            link={tree.species_desc === null ? null : tree.species_desc}
          />
          <TreeTag
            TreeTagValue={
              tree.gps_accuracy === null ? 'unknown' : tree.gps_accuracy
            }
            title="GPS Accuracy"
            icon={<Icon icon={AccuracyIcon} />}
            disabled={tree.gps_accuracy === null}
          />
          <TreeTag
            TreeTagValue={
              tree.morphology === null ? 'unknown' : tree.morphology
            }
            title="Morphology"
            icon={<Icon icon={HubIcon} />}
            disabled={tree.morphology === null}
          />
          <TreeTag
            TreeTagValue={
              tree.lat === null || tree.lon == null
                ? 'unknown'
                : `${shortenLongLat(tree.lat, 5)}, ${shortenLongLat(
                    tree.lon,
                    5,
                  )}`
            }
            title="Latitude, Longitude"
            icon={
              <Icon
                icon={GlobalIcon}
                sx={{
                  '& path': {
                    stroke: 'none',
                  },
                }}
              />
            }
            disabled={tree.lat === null || tree.lon === null}
          />
          <TreeTag
            TreeTagValue={
              tree.token_id === null ? 'Token not issued' : tree.token_id
            }
            title="Token ID"
            icon={<Icon icon={TokenIcon} />}
            subtitle={tree.token_id === null ? null : 'click to enter'}
            link={tree.token_id === null ? null : `/tokens/${tree.token_id}`}
            disabled={tree.token_id === null}
          />
          <TreeTag
            TreeTagValue={
              tree.wallet_name === null ? 'No wallet owns it' : tree.wallet_name
            }
            title="Wallet owner"
            icon={<Icon icon={AccountBalanceWalletIcon} />}
            subtitle={tree.wallet_name === null ? null : 'click to enter'}
            link={
              tree.wallet_name === null ? null : `/wallets/${tree.wallet_id}`
            }
            disabled={tree.wallet_name === null}
          />
        </TagList>
        <Divider
          varian="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
        <ImpactSection />
        <Box height={20} />
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
              src={isPlanterContext ? planter.image_url : organization.logo_url}
              variant="rounded"
            />
          </Portal>
        )}
      </Box>
    </>
  );
}

export const getServerSideProps = utils.wrapper(async ({ params }) => {
  const { treeid } = params;
  const tree = await getTreeById(treeid);
  const { planter_id, planting_organization_id } = tree;
  const planter = await getPlanterById(planter_id);
  let organization = null;
  if (planting_organization_id) {
    log.warn('load org from planting_orgniazation_id');
    organization = await getOrganizationById(planting_organization_id);
  } else if (planter.organization_id) {
    log.warn('load org from planter. organization_id');
    organization = await getOrganizationById(planter.organization_id);
  } else {
    log.warn('can not load org for tree:', tree, planter);
  }

  return {
    props: {
      tree,
      planter,
      organization,
    },
  };
});
