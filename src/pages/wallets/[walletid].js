/* eslint-disable @next/next/no-img-element */
import { useMediaQuery, useTheme, SvgIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import { getWalletById, getSpeciesByWalletId } from 'models/api';
import { requestAPI } from 'models/utils';
import ImpactSection from '../../components/ImpactSection';
import VerifiedBadge from '../../components/VerifiedBadge';
import BackButton from '../../components/common/BackButton';
import CustomCard from '../../components/common/CustomCard';
import Info from '../../components/common/Info';
import { useDrawerContext } from '../../context/DrawerContext';
import planterBackground from '../../images/background.png';
import CalendarIcon from '../../images/icons/calendar.svg';
import TreeIcon from '../../images/icons/tree.svg';
import imagePlaceholder from '../../images/image-placeholder.png';
import SearchIcon from '../../images/search.svg';
import { useMapContext } from '../../mapContext';

const placeholderText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
        nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
        velit ipsa illo, odit unde atque doloribus tempora distinctio facere
        dolorem expedita error. Natus, provident. Tempore harum repellendus
        reprehenderit vitae temporibus, consequuntur blanditiis officia
        excepturi, natus explicabo laborum delectus repudiandae placeat
        eligendi.`;

export default function Wallet(props) {
  log.info('props for wallet page:', props);

  const { wallet, species, tokenCount } = props;
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

  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

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
        map.setFilters({
          wallet: wallet.name,
        });
        try {
          await map.loadInitialView();
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
        log.warn('no data:', map, wallet);
      }
    }
    reload();
  }, [mapContext, wallet]);

  return (
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
          borderRadius: 4,
          mt: 6,
          '& img': {
            width: '100%',
          },
        }}
      >
        <img src={`${router.basePath}${planterBackground}`} alt="profile" />
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
            <Typography variant="h2">{wallet.name} </Typography>
            <Box sx={{ mt: 2 }}>
              <Info
                iconURI={CalendarIcon}
                info={`wallet since ${moment().format('MMMM DD, YYYY')}`}
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
            <Typography variant="h2">{wallet.name} </Typography>
          </Box>
        </Portal>
      )}

      {!isMobile && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h2">{wallet.name} </Typography>
          <Box sx={{ mt: 2 }}>
            <Info
              iconURI={CalendarIcon}
              info={`wallet since ${moment(wallet.created_at).format(
                'MMMM DD, YYYY',
              )}`}
            />
          </Box>
        </Box>
      )}

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
            iconURI={TreeIcon}
            sx={{ width: 26, height: 34 }}
            title="Tokens"
            text={tokenCount}
          />
        </Grid>
      </Grid>

      {tokenRegionName.length > 0 && (
        <Box sx={{ mt: [0, 22] }}>
          <CustomWorldMap totalTrees={tokenRegionCount} con={tokenRegionName} />
        </Box>
      )}

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
        {placeholderText}
      </Typography>
      <Divider
        varian="fullwidth"
        sx={{
          mt: [10, 20],
          pb: 2.5,
        }}
      />
      <ImpactSection />
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.walletid;
  try {
    const [wallet, species, tokenCount, tokenRegionCount] = await Promise.all([
      getWalletById(id),
      getSpeciesByWalletId(id),
      (async () => {
        // Todo write a filter api that only returns totalNo.of tokens under a certain wallet
        const data = await requestAPI(`/tokens?wallet=${id}`);
        return data.total;
      })(),
      (async () => {
        // return total no.trees/tokens per country
        const data = await requestAPI(`/wallets/${id}/token-region-count`);
        return data.walletStatistics;
      })(),
    ]);
    return {
      props: {
        wallet,
        species: species.species,
        tokenCount,
        tokenRegionCount,
      },
    };
  } catch (e) {
    return { notFound: true };
  }
}
