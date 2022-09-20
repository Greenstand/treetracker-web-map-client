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
import { Divider, Avatar, SvgIcon, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import TagList from 'components/common/TagList';
import UUIDTag from 'components/common/UUIDTag';
import { getWalletById, getTokenById } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import Badges from '../../components/Badges';
import ImpactSection from '../../components/ImpactSection';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Link from '../../components/Link';
import Share from '../../components/Share';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import Crumbs from '../../components/common/Crumbs';
import Info from '../../components/common/Info';
import SimpleAvatarAndName from '../../components/common/SimpleAvatarAndName';
import TreeTag from '../../components/common/TreeTag';
import { useMobile } from '../../hooks/globalHooks';
import CalendarIcon from '../../images/icons/calendar.svg';
import OriginIcon from '../../images/icons/origin.svg';
import ShareIcon from '../../images/icons/share.svg';
import TokenIcon from '../../images/icons/token.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';

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
  const { token, wallet, transactions, nextExtraIsEmbed, tree } = props;
  const theme = useTheme();
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const isMobile = useMobile();
  const router = useRouter();
  const userCameFromWalletPage = router.asPath.includes('wallets');

  log.warn('map:', mapContext);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && token) {
        // map.flyTo(tree.lat, tree.lon, 16);
        try {
          log.warn('xxxxxxxx reload');
          await map.setFilters({
            treeid: token.tree_id,
          });
          const view = await map.getInitialView();
          await map.gotoView(
            parseFloat(view.center.lat),
            parseFloat(view.center.lon),
            view.zoomLevel,
          );
          log.warn('no data:', map, token);
        } catch (e) {
          log.warn('get error when render map:', e);
        }
      }
    }
    reload();
  }, [mapContext, token]);
  console.log('token:', token);

  return (
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
              ...(userCameFromWalletPage
                ? [
                    {
                      url: `/wallets/${wallet.id}`,
                      icon: wallet.logo_url || (
                        <SvgIcon component={AccountBalanceWalletIcon} />
                      ),
                      name: wallet.name,
                    },
                  ]
                : []),
              {
                name: `token #${token.id}`,
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
          <LikeButton url={`https://map.treetracker.org/tokens/${token.id}`} />
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
              <SvgIcon component={CalendarIcon} />
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
        <Portal container={document.getElementById('drawer-title-container')}>
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
              <SvgIcon component={CalendarIcon} />
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
          container={document.getElementById('drawer-title-container-min')}
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
          icon={<SvgIcon component={CalendarIcon} />}
        />

        <TreeTag
          key="token-id"
          TreeTagValue={token.id}
          title="Token ID"
          icon={<SvgIcon component={TokenIcon} inheritViewBox />}
        />

        <TreeTag
          key="tree-id"
          TreeTagValue={token.tree_id}
          title="Tree ID"
          icon={
            <SvgIcon
              sx={{
                '& path': {
                  fill: 'rgb(71, 75, 79)',
                },
              }}
              component={TreeIcon}
              inheritViewBox
            />
          }
          subtitle="click to enter"
          link={`/trees/${token.tree_id}`}
        />

        <TreeTag
          key="claim"
          TreeTagValue={token.claim ? 'Claimed' : 'Not claimed yet'}
          title="Claim Status"
          icon={<SvgIcon component={DoneOutlineIcon} inheritViewBox />}
        />

        <TreeTag
          key="transferability"
          TreeTagValue={
            !token.claim && !token.transfer_pending
              ? 'Can be transferred'
              : 'Can not be transferred'
          }
          title="Transferability"
          icon={<SvgIcon component={CurrencyExchangeIcon} inheritViewBox />}
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
                <Link href="/planters/940">
                  <SimpleAvatarAndName
                    image={token.image_url}
                    name="Sebastian G."
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
                  <Link href={`/wallets/${transaction.destination_wallet_id}`}>
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
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  const { tokenid } = params;
  try {
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

    return {
      props: {
        token,
        wallet,
        transactions,
        tree,
      },
    };
  } catch (e) {
    log.error('token page:', e);
    if (e.response?.status === 404) return { notFound: true };
    throw e;
  }
}
