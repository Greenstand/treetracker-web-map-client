import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDrawerContext } from 'context/DrawerContext';
import DataTag from './DataTag';
import * as utils from '../../models/utils';
import VerifiedBadge from '../VerifiedBadge';

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '16px',
  [theme.breakpoints.down('md')]: {
    paddingTop: '7px',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  width: '100%',
  color: theme.palette.textPrimary.main,
  [theme.breakpoints.down('md')]: {
    paddingTop: '10px',
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.textLight.main,
  paddingTop: '4px',
}));

function PlanterAndOrganizationTitle({
  firstName,
  lastName,
  name,
  createdTime,
}) {
  return (
    <>
      <Title variant="h2">{name || `${firstName}  ${lastName}`}</Title>
      <Stack gap={{ xs: 1, sm: 2 }} sx={{ mb: 3, mt: [2, 3] }}>
        <DataTag data={utils.formatDates(createdTime, 'LL')} />
        <DataTag data="Shirimatunda, Tanzania" location />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          gap: [0, 2],
          marginTop: '13px',
          '&>*': {
            mr: 2,
          },
        }}
      >
        <VerifiedBadge verified badgeName="Verified Planter" />
        <VerifiedBadge badgeName="Seeking Orgs" />
      </Box>
    </>
  );
}

function TreeTitle({ treeId, verifiedTree, verifiedToken }) {
  return (
    <>
      <Title variant="h2">
        Palm Tree{/* tree.species */} - {treeId}
      </Title>
      <SubTitle sx={{ fontWeight: 400 }} variant="h5">
        Eco-Peace-Vision
      </SubTitle>
      <Box
        sx={{
          display: 'flex',
          gap: [0, 2],
          marginTop: '13px',
          '&>*': {
            mr: 2,
          },
        }}
      >
        <VerifiedBadge verified={verifiedTree} badgeName="Tree Verified" />
        <VerifiedBadge verified={verifiedToken} badgeName="Token Issued" />
      </Box>
    </>
  );
}

export default function DrawerTitle() {
  const {
    titlesData: {
      name,
      firstName,
      lastName,
      createdTime,
      treeId,
      verifiedTree,
      verifiedToken,
    },
  } = useDrawerContext();
  return (
    <Wrapper>
      {treeId ? (
        <TreeTitle
          treeId={treeId}
          verifiedTree={verifiedTree}
          verifiedToken={verifiedToken}
        />
      ) : (
        <PlanterAndOrganizationTitle
          firstName={firstName}
          lastName={lastName}
          createdTime={createdTime}
          name={name}
        />
      )}
    </Wrapper>
  );
}
