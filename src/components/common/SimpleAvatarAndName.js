import { Avatar, Box, Typography } from '@mui/material';

const imagePlaceholder = '/images/image-placeholder.png';

export default function SimpleAvatarAndName({ image, name }) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Avatar src={image || imagePlaceholder} />
      <Box sx={{ marginLeft: 3 }}>
        <Typography variant="h5">{name}</Typography>
      </Box>
    </Box>
  );
}
