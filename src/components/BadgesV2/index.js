import VerifiedBadge from '../VerifiedBadge';

function BadgesV2({content}) {


  return (
    <>
    {content?.map((data,index)=> {
        const {color,verified,badgeName,onClick}=data;
     return (  <VerifiedBadge
        key={index}
        color={color}
        verified={verified}
        badgeName={badgeName}
        onClick={onClick}
        />
     )
})}
   </>
  );
}

export default BadgesV2;
