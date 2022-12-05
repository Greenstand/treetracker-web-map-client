/* eslint-disable @next/next/no-img-element */
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Divider, Avatar, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HeadTag from 'components/HeadTag';
import TagList from 'components/common/TagList';
import UUIDTag from 'components/common/UUIDTag';
import { getWalletById, getTokenById, getPlanterById } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import { wrapper } from 'models/utils';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Link from '../../components/Link';
import Share from '../../components/Share';
import VerifiedBadge from '../../components/VerifiedBadge';
import Crumbs from '../../components/common/Crumbs';
import Icon from '../../components/common/CustomIcon';
import SimpleAvatarAndName from '../../components/common/SimpleAvatarAndName';
import TreeTag from '../../components/common/TreeTag';
import { useMobile } from '../../hooks/globalHooks';
import CalendarIcon from '../../images/icons/calendar.svg';
import ShareIcon from '../../images/icons/share.svg';
import TokenIcon from '../../images/icons/token.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';
import * as pathResolver from '../../models/pathResolver';

const useStyles = makeStyles()((theme) => ({
  tabBox: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(5),
    },
    flexWrap: 'wrap',
    display: 'flex',
    gap: 16,
  },
}));

function handleShare() {}

export default function Token(props) {
  log.warn('props:', props);
  const { token, wallet, transactions, nextExtraIsEmbed, tree, planter } =
    props;
  const theme = useTheme();
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const isMobile = useMobile();
  const router = useRouter();
  const userCameFromWalletPage = router.asPath.includes('wallets');
  const context = pathResolver.getContext(router, {
    base: process.env.NEXT_PUBLIC_BASE,
  });

  log.warn('map:', mapContext);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      // const { map } = mapContext;
      // if (map && token) {
      //   // map.flyTo(tree.lat, tree.lon, 16);
      //   try {
      //     log.warn('xxxxxxxx reload');
      //     await map.setFilters({
      //       treeid: token.tree_id,
      //     });
      //     const view = await map.getInitialView();
      //     await map.gotoView(
      //       parseFloat(view.center.lat),
      //       parseFloat(view.center.lon),
      //       view.zoomLevel,
      //     );
      //     log.warn('no data:', map, token);
      //   } catch (e) {
      //     log.warn('get error when render map:', e);
      //   }
      // }

      const { map } = mapContext;
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
          if (context.name === 'wallets') {
            log.warn('set wallet filter', context.id);
            await map.setFilters({
              wallet: wallet.name,
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
      }
    }
    reload();
  }, [mapContext, token]);
  log.warn('token:', token);

  const tokenIdStart = token.id.slice(0, 4);
  const tokenIdEnd = token.id.slice(token.id.length - 4, token.id.length);

  return (
    <>
      <HeadTag title={`Token #${tokenIdStart}...${tokenIdEnd}`} />
      <Box
        sx={[
          {
            padding: (t) => [t.spacing(0, 4), 6],
            width: 1,
            boxSizing: 'border-box',
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
                ...(context && context.name === 'wallets'
                  ? [
                      {
                        url: `/wallets/${wallet.id}`,
                        icon: wallet.logo_url || (
                          <Icon icon={AccountBalanceWalletIcon} />
                        ),
                        name: wallet.name,
                      },
                    ]
                  : []),
                {
                  name: (
                    <>
                      token #<UUIDTag uuid={token.id} />
                    </>
                  ),
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
            <LikeButton
              url={`https://map.treetracker.org/tokens/${token.id}`}
            />
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
            </Box>
          </Box>
          <img src={token.tree_image_url} alt="tree" />
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
                Token #<UUIDTag uuid={token.id} />
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.common.white,
                  display: 'flex',
                  alignItems: 'center',
                  filter: 'opacity(0.8)',
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
                {token.created_at !== null
                  ? `Minted on ${moment(tree.time_created).format(
                      'MMMM Do, YYYY',
                    )}`
                  : 'Unknown Mint Date'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                }}
              >
                <VerifiedBadge
                  color="secondary"
                  badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
                  verified={false}
                />
              </Box>
            </Box>
          )}
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
                Token #<UUIDTag uuid={token.id} />
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: theme.palette.common.black,
                  display: 'flex',
                  alignItems: 'center',
                  filter: 'opacity(0.8)',
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
                {token.created_at !== null
                  ? `Minted on ${moment(tree.time_created).format(
                      'MMMM Do, YYYY',
                    )}`
                  : 'Unknown Mint Date'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                }}
              >
                <VerifiedBadge
                  color="secondary"
                  badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
                  verified={false}
                />
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
              <Typography variant="h3" sx={{ fontsize: 20 }}>
                Token - #<UUIDTag uuid={token.id} />
              </Typography>
            </Box>
          </Portal>
        )}

        <Box
          sx={{
            mt: [4, 10],
          }}
        >
          <InformationCard1
            entityName={`${wallet.name} `}
            entityType="Wallet"
            buttonText="View the Wallet"
            cardImageSrc={wallet.logo_url || imagePlaceholder}
            link={`/wallets/${wallet.id}`}
          />
        </Box>
        <Typography
          variant="h4"
          sx={[
            {
              fontSize: [24, 28],
              lineHeight: (t) => [t.spacing(7.25), t.spacing(8.5)],
              mt: (t) => [t.spacing(14), t.spacing(18)],
            },
          ]}
        >
          Token Info
        </Typography>
        <TagList>
          <TreeTag
            key="created-at"
            TreeTagValue={new Date(token.created_at).toLocaleDateString()}
            title="Created At"
            icon={<Icon icon={CalendarIcon} />}
          />

          <TreeTag
            key="token-id"
            TreeTagValue={token.id}
            title="Token ID"
            icon={<Icon icon={TokenIcon} />}
          />

          <TreeTag
            key="tree-id"
            TreeTagValue={token.tree_id}
            title="Tree ID"
            icon={
              <Icon
                sx={{
                  '& path': {
                    fill: 'rgb(71, 75, 79)',
                  },
                }}
                icon={TreeIcon}
              />
            }
            subtitle="click to enter"
            link={`/trees/${token.tree_id}`}
          />

          <TreeTag
            key="claim"
            TreeTagValue={token.claim ? 'Claimed' : 'Not claimed yet'}
            title="Claim Status"
            icon={<Icon icon={DoneOutlineIcon} />}
          />

          <TreeTag
            key="transferability"
            TreeTagValue={
              !token.claim && !token.transfer_pending
                ? 'Can be transferred'
                : 'Can not be transferred'
            }
            title="Transferability"
            icon={<Icon icon={CurrencyExchangeIcon} />}
            disabled={token.claim === true && token.transfer_pending === true}
          />
        </TagList>

        <Typography
          variant="h4"
          sx={[
            {
              fontSize: [24, 28],
              lineHeight: (t) => [t.spacing(7.25), t.spacing(8.5)],
              mt: (t) => [t.spacing(14), t.spacing(18)],
            },
          ]}
        >
          Transaction History
        </Typography>
        <Box>
          <Timeline>
            <TimelineItem>
              <TimelineOppositeContent
                color="text.secondary"
                sx={{
                  flex: [0.4, 0.2],
                }}
              >
                {new Date(token.created_at).toLocaleDateString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">Token created by:</Typography>
                <Box
                  sx={{
                    p: [2, 4],
                  }}
                >
                  <Link href={`/planters/${planter.id}`}>
                    <SimpleAvatarAndName
                      image={planter.image_url}
                      name={`${planter.first_name} ${planter.last_name}`}
                    />
                  </Link>
                </Box>
              </TimelineContent>
            </TimelineItem>
            {transactions.transactions.map((transaction, index) => (
              <TimelineItem key={transaction.id}>
                <TimelineOppositeContent
                  sx={{
                    flex: [0.4, 0.2],
                  }}
                  color="text.secondary"
                >
                  {new Date(transaction.processed_at).toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">Transfer token between:</Typography>
                  <Box
                    sx={{
                      p: [2, 4],
                    }}
                  >
                    <Link href={`/wallets/${transaction.source_wallet_id}`}>
                      <Box
                        sx={{
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                        }}
                      >
                        {transaction.source_wallet_logo_url ? (
                          <Avatar
                            className={classes.media}
                            src={transaction.source_wallet_logo_url}
                          />
                        ) : (
                          <Avatar className={classes.media}>
                            <AccountBalanceWalletIcon />
                          </Avatar>
                        )}
                        <Box sx={{ marginLeft: 3 }}>
                          <Typography variant="h5">
                            {transaction.source_wallet_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        my: [1, 2],
                      }}
                    >
                      <ArrowDownwardIcon />
                    </Box>
                    <Link
                      href={`/wallets/${transaction.destination_wallet_id}`}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          width: '100%',
                          alignItems: 'center',
                        }}
                      >
                        {transaction.destination_wallet_logo_url ? (
                          <Avatar
                            className={classes.media}
                            src={transaction.destination_wallet_logo_url}
                          />
                        ) : (
                          <Avatar className={classes.media}>
                            <AccountBalanceWalletIcon />
                          </Avatar>
                        )}
                        <Box sx={{ marginLeft: 3 }}>
                          <Typography variant="h5">
                            {transaction.destination_wallet_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}
            <TimelineItem>
              <TimelineOppositeContent
                sx={{
                  flex: [0.4, 0.2],
                }}
                color="text.secondary"
              >
                pending
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>Claim Token</TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>

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
              src={wallet.logo_url ?? imagePlaceholder}
              variant="rounded"
            />
          </Portal>
        )}
      </Box>
    </>
  );
}

export const getServerSideProps = wrapper(async ({ params, query }) => {
  const { tokenid } = params;
  log.warn('tokenid:', tokenid);
  log.warn('query:', query);
  let result;
  if (tokenid === 'idfromquery') {
    log.warn('to load token from treeid');
    const { tree_id } = query;
    const treeId = parseInt(tree_id, 10);
    let res = await axios.get(`${process.env.NEXT_PUBLIC_API}/trees/${treeId}`);
    const { data: tree } = res;
    const token = await getTokenById(tree.token_id);
    const { wallet_id } = token;
    const wallet = await getWalletById(wallet_id);
    res = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/transactions?token_id=${token.id}`,
    );
    const { data: transactions } = res;
    const planter = await getPlanterById(tree.planter_id);

    result = {
      props: {
        token,
        wallet,
        transactions,
        tree,
        planter,
      },
    };
  } else {
    const token = await getTokenById(tokenid);
    const { wallet_id } = token;
    const wallet = await getWalletById(wallet_id);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/transactions?token_id=${tokenid}`,
    );
    const { data } = res;
    const transactions = data;
    let tree;
    {
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/trees/${token.tree_id}`,
      );
      tree = res2.data;
    }
    const planter = await getPlanterById(tree.planter_id);

    result = {
      props: {
        token,
        wallet,
        transactions,
        tree,
        planter,
      },
    };
  }

  return result;
});

// trigger
