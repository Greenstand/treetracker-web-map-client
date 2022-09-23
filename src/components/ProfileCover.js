import { Box } from '@mui/material';
import imagePlaceholder from '../images/image-placeholder.png';

function ProfileCover({ src }) {
  if (src) {
    return (
      <Box
        sx={{
          borderRadius: 4,
          '& img': {
            width: '100%',
            borderRadius: '16px',
            maxHeight: [212, 328],
            objectFit: 'cover',
            // maxWidth: [356, 672],
          },
        }}
      >
        <img src={src} alt="profile" />
      </Box>
    );
  } 
    return (
      <Box
        sx={{
          width: '100%',
          borderRadius: '16px',
          height: [212, 328],
          backgroundImage: `url(${imagePlaceholder})`,
          backgroundSize: '23% auto',
          backgroundColor: (t) => t.palette.primary.main,
          backgroundRepeat: 'space',
        }}
      />
    );
  
}

export default ProfileCover;
