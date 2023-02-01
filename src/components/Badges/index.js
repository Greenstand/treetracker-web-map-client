import VerifiedBadge from '../VerifiedBadge';

function Badges({ tokenId, verified }) {
  return (
    <>
      <VerifiedBadge
        color={!verified ? 'greyLight' : 'primary'}
        verified={verified}
        badgeName={!verified ? 'Waiting for verify' : 'Verified'}
      />
      <VerifiedBadge
        color="secondary"
        badgeName={!tokenId ? 'Token not issued' : 'Token Issued'}
      />
    </>
  );
}

export default Badges;
