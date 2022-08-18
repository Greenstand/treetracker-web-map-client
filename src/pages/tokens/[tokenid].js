/* eslint-disable @next/next/no-img-element */
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Avatar, SvgIcon, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
import { useEffect } from 'react';
import { getWalletById, getTokenById } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import Badges from '../../components/Badges';
import InformationCard1 from '../../components/InformationCard1';
import LikeButton from '../../components/LikeButton';
import Share from '../../components/Share';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import Info from '../../components/common/Info';
import TreeTag from '../../components/common/TreeTag';
import { useMobile } from '../../hooks/globalHooks';
import CalendarIcon from '../../images/icons/calendar.svg';
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

export default function Token({ token, wallet, nextExtraIsEmbed }) {
  const theme = useTheme();
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const isMobile = useMobile();

  log.warn('map:', mapContext);

  const tags = [];
  const tagsTail = [];
  tags.push(
    <TreeTag
      key="created-at"
      TreeTagValue={new Date(token.created_at).toLocaleDateString()}
      title="Created At"
      icon={<SvgIcon component={CalendarIcon} />}
    />,
  );

  tags.push(
    <TreeTag
      key="token-id"
      TreeTagValue={token.id}
      title="Token ID"
      icon={<SvgIcon component={TokenIcon} inheritViewBox />}
    />,
  );

  tags.push(
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
    />,
  );

  tags.push(
    <TreeTag
      key="claim"
      TreeTagValue={token.claim ? 'Claimed' : 'Not claimed yet'}
      title="Claim Status"
      icon={<SvgIcon component={DoneOutlineIcon} inheritViewBox />}
    />,
  );

  if (!token.claim && !token.transfer_pending) {
    tags.push(
      <TreeTag
        key="transferability"
        TreeTagValue="Can be transferred"
        title="Transferability"
        icon={<SvgIcon component={CurrencyExchangeIcon} inheritViewBox />}
      />,
    );
  } else {
    tagsTail.push(
      <TreeTag
        key="transferability"
        TreeTagValue="Can not be transferred"
        title="Transferability"
        icon={<SvgIcon component={CurrencyExchangeIcon} />}
        disabled
      />,
    );
  }

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && token) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          token: token.id,
        });
        try {
          await map.loadInitialView();
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
        log.warn('no data:', map, token);
      }
    }
    reload();
  }, [mapContext, token]);

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
              Token #{token.id}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
              color={theme.palette.common.white}
            >
              {token.tree_species_name || 'Unkown species'}
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
            <Typography
              variant="h2"
              sx={{
                '&': {
                  fontSize: '15px',
                },
              }}
            >
              Token #{token.id}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="h5"
            >
              {token.tree_species_name || 'Unkown species'}
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
              Token - #{token.id}
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
              />
            </Box>
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

      <Box className={classes.tabBox}>
        {tags}
        {tagsTail}
      </Box>
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

    return {
      props: {
        token,
        wallet,
      },
    };
  } catch (e) {
    return { notFound: true };
  }
}
