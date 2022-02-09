import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import { useEffect, useState } from 'react';
import CustomWorldMap from 'components/CustomWorldMap';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import CustomImageWrapper from 'components/common/CustomImageWrapper';
import { getPlanterById, getOrgLinks } from 'models/api';
import InformationCard1 from '../../components/InformationCard1';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import CustomCard from '../../components/common/CustomCard';
import DataTag from '../../components/common/DataTag';
import { useMapContext } from '../../mapContext';
import { makeStyles } from '../../models/makeStyles';
import * as utils from '../../models/utils';

// make styles for component with material-ui
const useStyles = makeStyles()((theme) => ({
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  treeSlider: {
    marginTop: theme.spacing(10),
  },
  divider: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(14),
      marginBottom: theme.spacing(14),
    },
  },
  textColor: {
    color: theme.palette.textPrimary.main,
  },
}));

const placeholderText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa iusto
        nesciunt quasi praesentium non cupiditate ratione nihil. Perferendis,
        velit ipsa illo, odit unde atque doloribus tempora distinctio facere
        dolorem expedita error. Natus, provident. Tempore harum repellendus
        reprehenderit vitae temporibus, consequuntur blanditiis officia
        excepturi, natus explicabo laborum delectus repudiandae placeat
        eligendi.`;
export default function Planter({ planter }) {
  const { featuredTrees } = planter;
  const treeCount = featuredTrees.trees.length;
  const mapContext = useMapContext();

  const [isPlanterTab, setIsPlanterTab] = useState(true);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { classes } = useStyles();

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && planter) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          userid: planter.id,
        });
        try {
          await map.loadInitialView();
        } catch (err) {
          log.warn('error:', err);
        }
        map.rerender();
        log.warn('no data:', map, planter);
      }
    }
    reload();
  }, [mapContext, planter]);

  return (
    <PageWrapper>
      <Typography variant="h2" className={classes.textColor}>
        {utils.hideLastName(`${planter.first_name}${planter.last_name}`)}
      </Typography>

      <Stack gap={{ xs: 1, sm: 2 }} sx={{ mb: 3, mt: [2, 3] }}>
        <DataTag data={utils.formatDates(planter.created_time, 'LL')} />
        <DataTag data="Shirimatunda, Tanzania" location />
      </Stack>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <VerifiedBadge verified badgeName="Verified Planter" />
        <VerifiedBadge badgeName="Seeking Orgs" />
      </Box>

      {!isMobileScreen && (
        <Divider variant="fullWidth" sx={{ mt: 7, mb: 13.75 }} />
      )}

      <Avatar
        src={planter.image_url}
        variant="rounded"
        sx={{
          width: '100%',
          height: '688px',
          borderRadius: 6,
          mt: 11,
          mb: [6, 10],
        }}
      />
      <Grid
        container
        wrap="nowrap"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Grid item sx={{ width: '49%' }}>
          <CustomCard
            handleClick={() => setIsPlanterTab(true)}
            icon={<ParkOutlinedIcon fontSize="large" />}
            title="Trees Planted"
            text={treeCount}
            disabled={!isPlanterTab}
          />
        </Grid>
        <Grid item sx={{ width: '49%' }}>
          <CustomCard
            handleClick={() => setIsPlanterTab(false)}
            icon={<GroupsOutlinedIcon fontSize="large" />}
            title="Ass. Orgs"
            text={planter.associatedOrganizations.length}
            disabled={isPlanterTab}
          />
        </Grid>
      </Grid>
      {isPlanterTab && (
        <>
          <Box sx={{ mt: [0, 22] }}>
            <CustomWorldMap totalTrees={treeCount} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: [16, 24],
              color: 'textPrimary.main',
              mt: [0, 20],
              mb: [6, 10],
            }}
          >
            Species of trees planted
          </Typography>
          <Box className={classes.speciesBox}>
            {planter.species.species.map((species) => (
              <TreeSpeciesCard
                key={species.id}
                name={species.name}
                count={species.count}
              />
            ))}
            {/* Placeholder, remove after API fixed */}
            <TreeSpeciesCard name="Baobab Tree" count={10} />
            <TreeSpeciesCard name="Wattle Tree" count={2} />
          </Box>
        </>
      )}
      {/* {!isPlanterTab &&
        planter.associatedOrganizations.organizations.map((org) => (
          <div key={org.id}>
            <InformationCard1
              entityName={org.name}
              entityType="Planting Organization"
              buttonText="Meet the Organization"
              cardImageSrc={org?.logo_url}
              link={`/organizations/${org.id}`}
            />
          </div>
        ))} */}
      {/* placeholder until API can return the correct data, should be removed */}
      {!isPlanterTab && (
        <Stack
          spacing={{ xs: 6, sm: 12 }}
          p={{ xs: 0, sm: 6 }}
          pt={0}
          mt={{ xs: 14, sm: 22 }}
        >
          <InformationCard1
            entityName="Greenway International Foundation"
            entityType="Planting Organization"
            buttonText="Meet the Organization"
            link="/organizations/1"
          />
          <InformationCard1
            entityName="One Tree Planted"
            entityType="Planting Organization"
            buttonText="Meet the Organization"
            link="/organizations/1"
          />
        </Stack>
      )}

      <Divider varian="fullwidth" className={classes.divider} />
      <Typography variant="h4" className={classes.textColor}>
        About the Planter
      </Typography>
      <Typography variant="body2" className={classes.textColor} mt={7}>
        {placeholderText}
        {planter.about}
      </Typography>
      <Typography
        variant="h4"
        className={classes.textColor}
        sx={{ mt: { xs: 10, md: 16 } }}
      >
        Mission
      </Typography>
      <Typography variant="body2" className={classes.textColor} mt={7}>
        {placeholderText}
        {planter.mission}
      </Typography>
      <Divider varian="fullwidth" className={classes.divider} />
      <Typography variant="h4" className={classes.textColor} mb={9}>
        Check out the planting effort in action
      </Typography>
      <Box mb={17}>
        {/* Placeholder image, should be changed later */}
        <CustomImageWrapper
          imageUrl={planter.image_url}
          timeCreated={planter.time_created}
          treeId={planter.id}
        />
      </Box>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.planterid;
  const planter = await getPlanterById(id);
  const data = await getOrgLinks(planter.links);
  return {
    props: { planter: { ...planter, ...data } },
  };
}
