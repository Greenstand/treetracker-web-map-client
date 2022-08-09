/* eslint-disable @next/next/no-img-element */
import { useMediaQuery, useTheme, Avatar, SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
import { useEffect } from 'react';
import { getWalletById, getTokenById } from 'models/api';
import { makeStyles } from 'models/makeStyles';
import InformationCard1 from '../../components/InformationCard1';
import Share from '../../components/Share';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import Info from '../../components/common/Info';
import TreeTag from '../../components/common/TreeTag';
import CalendarIcon from '../../images/icons/calendar.svg';
import ShareIcon from '../../images/icons/share.svg';
import TokenIcon from '../../images/icons/token.svg';
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

export default function Token({ token, wallet }) {
  const { classes } = useStyles();
  const mapContext = useMapContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  log.warn('map:', mapContext);

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
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          mt: 6,
          '& img': {
            width: '100%',
            borderRadius: 4,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            pt: [4, 6],
            px: [4, 6],
            width: 1,
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
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
        <img src={`${token.tree_image_url}`} alt="token" />
        <Avatar
          src={imagePlaceholder}
          // src={wallet.logo_url}
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
            <Typography
              variant="h2"
              sx={{
                '&': {
                  fontSize: '15px',
                },
              }}
            >
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
                color="primary"
                verified={token.claim}
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
              />
              <VerifiedBadge
                color="secondary"
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
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
            <Typography variant="h2" sx={{ fontsize: 20 }}>
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
                color="primary"
                verified={token.claim}
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
              />
              <VerifiedBadge
                color="secondary"
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
              />
            </Box>
          </Box>
        </Portal>
      )}

      {!isMobile && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h2" sx={{ fontSize: 20 }}>
            Token - #{token.id}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
              }}
            >
              <VerifiedBadge
                color="primary"
                verified={token.claim}
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
              />
              <VerifiedBadge
                color="secondary"
                badgeName={`${token.claim ? 'Claimed' : 'Unclaimed'}`}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={[
          {
            mt: [6, 14],
          },
        ]}
      >
        <InformationCard1
          entityName={token.tree_species_name}
          entityType="Token Tree"
          buttonText="View Token Tree"
          cardImageSrc={token?.tree_image_url}
          link={`/trees/${token.tree_id}`}
        />
      </Box>
      <Box
        sx={{
          mt: [4, 10],
        }}
      >
        <InformationCard1
          entityName={`${wallet.name} `}
          entityType="Wallet"
          buttonText="View the Wallet"
          cardImageSrc={imagePlaceholder}
          // cardImageSrc={wallet?.logo_url}
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
        <TreeTag
          TreeTagValue={new Date(token.created_at).toLocaleDateString()}
          title="Created At"
          icon={<SvgIcon component={CalendarIcon} inheritViewBox />}
        />
        <TreeTag
          TreeTagValue={token.id}
          title="Token ID"
          icon={<SvgIcon component={TokenIcon} inheritViewBox />}
        />
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
