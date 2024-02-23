import { Avatar } from '@mui/material';
// import imagePlaceholder from 'images/image-placeholder.png';

const imagePlaceholder = 'images/image-placeholder.png';

function ProfileAvatar({ src, rotation, sx = {}, noBackground = false }) {
  return (
    <Avatar
      src={src || imagePlaceholder}
      sx={{
        width: [120, 189],
        height: [120, 189],
        transform: rotation && `rotate(${rotation}deg)`,
        boxSizing: 'border-box',
        ml: [4, 8],
        mt: [-98 / 4, -146 / 4],
        ...(noBackground
          ? {}
          : {
              borderWidth: [4, 9],
              borderStyle: 'solid',
              borderColor: (t) => t.palette.background.paper,
              backgroundColor: (t) => t.palette.background.avatar,
            }),
        ...sx,
      }}
    />
  );
}

export default ProfileAvatar;
