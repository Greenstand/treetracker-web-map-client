import { Box } from '@mui/material';

function TypographyThumbnail({ text, previewStyle }) {
  return (
    <Box
      sx={{
        ...previewStyle,
      }}
    >
      {text}
    </Box>
  );
}

export default TypographyThumbnail;
