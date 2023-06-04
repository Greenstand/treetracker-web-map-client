import { useRouter } from 'next/router';
import VerifiedBadge from '../VerifiedBadge';

function Badges({
  tokenId,
  verified,
  treeId,
  showTreeMatchStatus = false, // to control visbility of tree-match status on treeid and captureid page
}) {
  const router = useRouter();

  return (
    <>
      <VerifiedBadge
        color={!verified ? 'greyLight' : 'primary'}
        verified={verified}
        badgeName={!verified ? 'Waiting for verification' : 'Verified'}
      />
      <VerifiedBadge
        color="secondary"
        badgeName={!tokenId ? 'Token not issued' : 'Token Issued'}
      />
      {showTreeMatchStatus && (
        <VerifiedBadge
          color={!treeId ? 'greyLight' : 'primary'}
          badgeName={!treeId ? 'Waiting for tree match' : 'Tree matched'}
          onClick={
            !treeId
              ? null
              : () => {
                  router.push(`/trees/${treeId}`);
                }
          }
          verified={treeId}
        />
      )}
    </>
  );
}

export default Badges;
