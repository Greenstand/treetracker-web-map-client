import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import { marked } from 'marked';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import FeaturedTreesSlider from 'components/FeaturedTreesSlider';
import HeadTag from 'components/HeadTag';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import TreeTag from 'components/common/TreeTag';
import { getWalletById, getSpeciesByWalletId } from 'models/api';
import { requestAPI, wrapper } from 'models/utils';
import ImpactSection from '../../components/ImpactSection';
import ProfileCover from '../../components/ProfileCover';
import Crumbs from '../../components/common/Crumbs';
import CustomCard from '../../components/common/CustomCard';
import Icon from '../../components/common/CustomIcon';
import Info from '../../components/common/Info';
import { useDrawerContext } from '../../context/DrawerContext';
import { useMobile } from '../../hooks/globalHooks';
import CalendarIcon from '../../images/icons/calendar.svg';
import TokenIcon from '../../images/icons/token.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';
import * as pathResolver from '../../models/pathResolver';

const placeholderText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
        nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
        velit ipsa illo, odit unde atque doloribus tempora distinctio facere
        dolorem expedita error. Natus, provident. Tempore harum repellendus
        reprehenderit vitae temporibus, consequuntur blanditiis officia
        excepturi, natus explicabo laborum delectus repudiandae placeat
        eligendi.`;

export default function Wallet(props) {
  log.info('props for wallet page:', props);
  const [isTokenTab, setIsTokenTab] = React.useState(false);
  const { wallet, species, tokens, trees } = props;
  const isMobile = useMobile();
  // eslint-disable-next-line react/destructuring-assignment
  const tokenRegionStatistics = props.tokenRegionCount.filter(
    (statistics) => statistics.continent !== null,
  );
  const tokenRegionName = [];
  const tokenRegionCount = [];
  tokenRegionStatistics.forEach((obj) => {
    tokenRegionName.push(obj.continent);
    tokenRegionCount.push(obj.token_count);
  });

  const mapContext = useMapContext();

  const router = useRouter();

  const { setTitlesData } = useDrawerContext();

  useEffect(() => {
    setTitlesData({
      firstName: wallet.name,
      createdTime: wallet.created_at,
    });
  }, [wallet.name, wallet.created_at, setTitlesData]);

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && wallet) {
        // map.flyTo(tree.lat, tree.lon, 16);
        log.warn('set filter for wallet');
        await map.setFilters({
          wallet: wallet.name,
        });
        const bounds = pathResolver.getBounds(router);
        if (bounds) {
          log.warn('goto bounds found in url');
          await map.gotoBounds(bounds);
        } else {
          const view = await map.getInitialView();

          if (view.zoomLevel < 2) {
            view.zoomLevel = 2;
          }
          await map.gotoView(view.center.lat, view.center.lon, view.zoomLevel);
        }
      }
    }
    reload();
  }, [mapContext, wallet]);
  return (
    <>
      <HeadTag title={`${wallet.name} - Wallet`} />
      <Box
        sx={[
          {
            padding: (t) => [t.spacing(0, 4), 6],
            width: 1,
            boxSizing: 'border-box',
            // overflow : 'scroll'
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
                {
                  icon: wallet.logo_url || (
                    <Icon icon={AccountBalanceWalletIcon} />
                  ),
                  name: `${wallet.name}`,
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
          sx={{
            borderRadius: 4,
            mt: 6,
            '& img': {
              width: '100%',
            },
          }}
        >
          <ProfileCover src={wallet?.cover_url || trees?.[0]?.image_url} />
          <Avatar
            src={wallet.logo_url || imagePlaceholder}
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
          <Portal
            container={() => document.getElementById('drawer-title-container')}
          >
            <Box
              sx={{
                px: 4,
                pb: 4,
              }}
            >
              <Typography variant="h2">{wallet.name} </Typography>
              <Box sx={{ mt: 2 }}>
                <Info
                  iconURI={CalendarIcon}
                  info={`Wallet created on ${moment(wallet.created_at).format(
                    'MMMM DD, YYYY',
                  )}`}
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
              <Typography variant="h3">{wallet.name} </Typography>
            </Box>
          </Portal>
        )}

        {!isMobile && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h2">{wallet.name} </Typography>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={`Wallet created on ${moment(wallet.created_at).format(
                  'MMMM DD, YYYY',
                )}`}
              />
            </Box>
          </Box>
        )}
        <Box
          sx={{
            mt: [8, 16],
          }}
        >
          <Typography variant="h4">Featured trees by {wallet.name}</Typography>
          <FeaturedTreesSlider
            trees={trees}
            link={(item) => `/wallets/${wallet.id}/tokens/${item.token_id}`}
          />
        </Box>

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
              handleClick={() => setIsTokenTab(false)}
              iconURI={TreeIcon}
              iconProps={{
                sx: {
                  '& path': {
                    fill: ({ palette }) => palette.primary.main,
                  },
                },
              }}
              title="Trees"
              text={tokens.total}
              disabled={isTokenTab}
            />
          </Grid>
          <Grid item sx={{ width: '49%' }}>
            <CustomCard
              handleClick={() => setIsTokenTab(true)}
              iconURI={TokenIcon}
              iconProps={{
                sx: {
                  '& path': {
                    fill: ({ palette }) => palette.text.primary,
                  },
                },
              }}
              title="Tokens"
              text={tokens.total}
              disabled={!isTokenTab}
            />
          </Grid>
        </Grid>

        {tokenRegionName.length > 0 && (
          <Box sx={{ mt: [0, 22], display: !isTokenTab ? 'block' : 'none' }}>
            <CustomWorldMap
              totalTrees={tokenRegionCount}
              con={tokenRegionName}
            />
          </Box>
        )}

        <Box
          sx={{
            mt: [0, 16],
            p: [2, 4],
            display: isTokenTab ? 'block' : 'none',
          }}
        >
          {tokens.tokens.map((token) => (
            <Box
              key={token.id}
              sx={{
                mt: [2, 4],
              }}
            >
              <TreeTag
                TreeTagValue={token.id}
                title="Token ID"
                icon={<Icon icon={TokenIcon} />}
                link={`/wallets/${wallet.id}/tokens/${token.id}`}
              />
            </Box>
          ))}
        </Box>

        {species.length > 0 && (
          <Box
            sx={{
              px: [0, 6],
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: [16, 24],
                mt: [5, 10],
              }}
            >
              Species of trees planted
            </Typography>
            <Box
              sx={{
                mt: [5, 10],
              }}
            >
              {species.map((specie) => (
                <TreeSpeciesCard
                  key={specie.id}
                  name={specie.name}
                  count={specie.total}
                  subTitle={specie.desc || '---'}
                />
              ))}
            </Box>
          </Box>
        )}
        <Divider
          varian="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
        <Typography sx={{ mt: [2.5, 5] }} variant="h4">
          About the Wallet
        </Typography>
        <Typography sx={{ mt: [2.5, 5] }} variant="body2">
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(wallet.about || 'NO DATA YET'),
            }}
          />
        </Typography>
        <Divider
          varian="fullwidth"
          sx={{
            mt: [10, 20],
          }}
        />
        <ImpactSection />
      </Box>
    </>
  );
}

export const getServerSideProps = wrapper(async ({ params }) => {
  const wallet = await getWalletById(params.walletid);
  const { id } = wallet;
  const [species, tokens, tokenRegionCount, trees] = await Promise.all([
    getSpeciesByWalletId(id),
    (async () => {
      // Todo write a filter api that only returns totalNo.of tokens under a certain wallet
      const data = await requestAPI(`/tokens?wallet=${id}`);
      return data;
    })(),
    (async () => {
      // return total no.trees/tokens per country
      const data = await requestAPI(`/wallets/${id}/token-region-count`);
      return data.walletStatistics;
    })(),
    (async () => {
      const data = await requestAPI(`/trees?wallet_id=${id}`);
      return data;
    })(),
  ]);

  return {
    props: {
      wallet,
      species: species.species,
      tokens,
      tokenRegionCount,
      trees: trees.trees,
    },
  };
});
