import { Avatar } from '@mui/material';

function ProfileAvatar({ src, rotation }) {
  return (
    <Avatar
      src={src}
      sx={{
        width: [120, 189],
        height: [120, 189],
        transform: rotation && `rotate(${rotation}deg)`,
        borderWidth: [4, 9],
        borderStyle: 'solid',
        borderColor: (t) => t.palette.background.paper,
        backgroundColor: (t) => t.palette.background.avatar,
        boxSizing: 'border-box',
        ml: [4, 8],
        mt: [-98 / 4, -146 / 4],
      }}
    />
  );
}

export default ProfileAvatar;
