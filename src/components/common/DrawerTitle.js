import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DataTag from './DataTag';
import * as utils from '../../models/utils';
import VerifiedBadge from '../VerifiedBadge';

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3, 4),
}));

const IsTitlePlanterHideOnMobile = styled(Box)(({ treeId, firstName }) => ({
  display: !treeId && firstName ? 'block' : 'none',
}));

const IsTitleTreeHideOnMobile = styled(Box)(({ treeId }) => ({
  display: treeId ? 'block' : 'none',
}));

function PlanterTitle({ firstName, lastName, createdTime, widthTitle }) {
  return (
    <>
      <Typography
        variant="h2"
        color="textSecondary"
        width={widthTitle}
        noWrap
        sx={{
          color: 'textPrimary.main',
          textOverflow: 'clip',
        }}
      >
        {firstName} {lastName}
      </Typography>

      <Stack gap={{ xs: 1, sm: 2 }} sx={{ mb: 3, mt: [2, 3] }}>
        <DataTag data={utils.formatDates(createdTime, 'LL')} />
        <DataTag data="Shirimatunda, Tanzania" location />
      </Stack>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <VerifiedBadge verified badgeName="Verified Planter" />
        <VerifiedBadge badgeName="Seeking Orgs" />
      </Box>
    </>
  );
}

function TreeTitle({ treeId, verifiedTree, verifiedToken }) {
  return (
    <>
      <Typography sx={{ color: 'textPrimary.main' }} variant="h2">
        Tree{/* tree.species */} - #{treeId}
      </Typography>
      <Typography
        sx={{ color: 'textPrimary.main', fontWeight: 400, m: 2 }}
        variant="h5"
      >
        Eco-Peace-Vision
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 4,
          '&>*': {
            mr: 4,
          },
        }}
      >
        <VerifiedBadge verified={verifiedTree} badgeName="Tree Verified" />
        <VerifiedBadge verified={verifiedToken} badgeName="Token Issued" />
      </Box>
    </>
  );
}
export default function DrawerTitles({
  firstName,
  lastName,
  createdTime,
  widthTitle,
  treeId,
  verifiedTree,
  verifiedToken,
}) {
  return (
    <Wrapper>
      <IsTitlePlanterHideOnMobile treeId={treeId} firstName={firstName}>
        <PlanterTitle
          firstName={firstName}
          lastName={lastName}
          createdTime={createdTime}
          widthTitle={widthTitle}
        />
      </IsTitlePlanterHideOnMobile>

      <IsTitleTreeHideOnMobile treeId={treeId}>
        <TreeTitle
          treeId={treeId}
          verifiedTree={verifiedTree}
          verifiedToken={verifiedToken}
        />
      </IsTitleTreeHideOnMobile>
    </Wrapper>
  );
}
