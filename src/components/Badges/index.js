import VerifiedBadge from '../VerifiedBadge';

function Badges({ content }) {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    (<>
      {content?.map((data, index) => {
        const {
          color,
          verified,
          badgeName,
          onClick = null,
          disabled = false,
        } = data;
        return (
          <VerifiedBadge
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            color={color}
            verified={verified}
            badgeName={badgeName}
            onClick={onClick}
            disabled={disabled}
          />
        );
      })}
    </>)
  );
}

export default Badges;
