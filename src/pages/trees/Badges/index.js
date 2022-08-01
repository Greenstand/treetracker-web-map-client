import VerifiedBadge from '../../../components/VerifiedBadge';

function Badges({ tokenId, verified }) {
  return (
    <>
      <VerifiedBadge
        color="primary"
        verified={verified}
        badgeName={!verified ? 'Waiting for verify' : 'Verified Planter'}
      />
      <VerifiedBadge
        color="secondary"
        badgeName={!tokenId ? 'Token not issued' : 'Token Issued'}
      />
    </>
  );
}

export default Badges;
