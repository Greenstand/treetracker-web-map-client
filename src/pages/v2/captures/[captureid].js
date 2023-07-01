/* eslint-disable @next/next/no-img-element */
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckIcon from '@mui/icons-material/Check';
import HubIcon from '@mui/icons-material/Hub';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme, Avatar, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import Badge from 'components/Badge';
import HeadTag from 'components/HeadTag';
import ImpactSection from 'components/ImpactSection';
import InformationCard1 from 'components/InformationCard1';
import LikeButton from 'components/LikeButton';
import Share from 'components/Share';
import TreeInfoDialog from 'components/TreeInfoDialog';
import Crumbs from 'components/common/Crumbs';
import Icon from 'components/common/CustomIcon';
import TagList from 'components/common/TagList';
import TreeTag from 'components/common/TreeTag';
import { useDrawerContext } from 'context/DrawerContext';
import { useMobile, useEmbed } from 'hooks/globalHooks';
import AccuracyIcon from 'images/icons/accuracy.svg';
import CalendarIcon from 'images/icons/calendar.svg';
import GlobalIcon from 'images/icons/global.svg';
import HistoryIcon from 'images/icons/history.svg';
import LocationIcon from 'images/icons/location.svg';
import OriginIcon from 'images/icons/origin.svg';
import ShareIcon from 'images/icons/share.svg';
import TokenIcon from 'images/icons/token.svg';
import imagePlaceholder from 'images/image-placeholder.png';
import SearchIcon from 'images/search.svg';
import { useMapContext } from 'mapContext';
import {
  getStakeHolderById,
  getCapturesById,
  getGrowerById,
  getCountryByLatLon,
} from 'models/api';
import * as pathResolver from 'models/pathResolver';
import * as utils from 'models/utils';

export default function Capture({
  tree,
  grower,
  organization,
  nextExtraIsEmbed,
  nextExtraKeyword,
  country,
}) {
  log.warn('tree: ', tree);
  log.warn('org: ', organization.stakeholders[0]);
  log.warn('grower: ', grower);
  log.warn('country: ', country);

  const mapContext = useMapContext();
  const { map } = mapContext;
  const theme = useTheme();
  const router = useRouter();
  const context = pathResolver.getContext(router, {
    base: process.env.NEXT_PUBLIC_BASE,
  });
  const isMobile = useMobile();
  const isEmbed = useEmbed();
  const isPlanterContext = context && context.name === 'grower';
  const isOrganizationContext = context && context.name === 'organizations';

  const { setTitlesData } = useDrawerContext();
  log.warn('map:', mapContext);

  const { org_name, logo_url, id } = organization.stakeholders[0];

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
            log.warn('set grower filter', context.id);
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

  log.warn(grower, 'grower');

  // storing under variable with useMemo wrapped
  // to reuse the same component for mobile and desktop and
  // avoid re-rendering of badge components
  const BadgeSection = useMemo(
    () => (
      <>
        <Badge
          color={tree?.approved ? 'primary' : 'greyLight'}
          icon={tree?.approved ? <CheckIcon /> : null}
          badgeName={tree?.approved ? 'Verified' : 'Waiting for verification'}
        />
        <Badge
          color="secondary"
          badgeName={tree?.token_id ? 'Token issued' : 'Token not issued'}
        />
        <Badge
          color={tree.id ? 'primary' : 'greyLight'}
          badgeName={tree.id ? 'Tree matched' : 'Waiting for tree match'}
          onClick={tree.id ? () => router.push(`/trees/${tree.id}`) : null}
        />
      </>
    ),
    [tree?.approved, tree?.token_id, tree?.id],
  );

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
                  {`Captured on ${moment(tree.created_at).format(
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

                  {`Located in ${country.name || 'Unknown location'}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
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
                        url: `/grower-accounts/${grower.id}`,
                        icon: grower.image_url,
                        name: `${utils.getPlanterName(
                          grower.first_name,
                          grower.last_name,
                        )}`,
                      },
                    ]
                  : []),
                ...(isOrganizationContext && organization
                  ? [
                      {
                        url: `/stakeholder/stakeholders/${id}`,
                        icon: logo_url,
                        name: org_name,
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
                objectFit: 'cover',
                width: '100%',
                [theme.breakpoints.down('sm')]: {
                  maxHeight: '450px',
                },
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
                planter={grower}
                organization={organization}
              />
            </Box>
          </Box>
          <img src={tree.image_url} alt="tree" height="764" />
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
                  {`Captured on ${moment(tree.created_at).format(
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
                  {`Located in ${country.name}` || 'Unknown location'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                }}
              >
                {BadgeSection}
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
              entityName={org_name}
              entityType="Planting Organization"
              buttonText="Meet the Organization"
              cardImageSrc={logo_url || imagePlaceholder}
              // TODO: this wont work until organizationsV2 page is completed
              link={`/stakeholder/stakeholders/${id}?keyword=${nextExtraKeyword}${
                isEmbed ? '&embed=true' : ''
              }`}
            />
          </Box>
        )}
        <Box
          sx={{
            mt: [4, 10],
          }}
        >
          <InformationCard1
            entityName={`${grower.first_name} ${grower.last_name}`}
            entityType="Grower"
            buttonText="Meet the Grower"
            cardImageSrc={grower?.image_url || imagePlaceholder}
            rotation={grower?.image_rotation}
            // TODO: this wont work until growers page is completed
            link={`/grower-accounts/${grower.id}?keyword=${nextExtraKeyword}${
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
            TreeTagValue={new Date(tree.created_at).toLocaleDateString()}
            title="Captured on"
            icon={<Icon icon={CalendarIcon} />}
          />
          <TreeTag
            TreeTagValue={tree.verified === false ? 'not verified' : 'verifed'}
            title="Verification"
            icon={<Icon icon={VerifiedIcon} />}
            disabled={tree.verified === false}
          />
          <TreeTag
            TreeTagValue={country.name === null ? 'unknown' : country.name}
            title="Located in"
            icon={<Icon icon={LocationIcon} />}
            disabled={country.name === null}
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
              src={isPlanterContext ? grower.image_url : logo_url}
              variant="rounded"
            />
          </Portal>
        )}
      </Box>
    </>
  );
}

async function serverSideData(params) {
  const { captureid } = params;
  const tree = await getCapturesById(captureid);
  const { planting_organization_id, grower_account_id, lat, lon } = tree;
  const grower = await getGrowerById(grower_account_id);
  const country = await getCountryByLatLon(lat, lon);
  let organization = await getStakeHolderById(planting_organization_id);

  if (planting_organization_id) {
    log.warn('load org from planting_orgniazation_id');
    organization = await getStakeHolderById(planting_organization_id);
  } else if (grower.organization_id) {
    log.warn('load org from planter. organization_id');
    organization = await getStakeHolderById(grower.organization_id);
  } else {
    log.warn('can not load org for tree:', tree, grower);
  }

  return {
    tree,
    grower,
    organization,
    country,
  };
}

const getStaticProps = utils.wrapper(async ({ params }) => {
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
