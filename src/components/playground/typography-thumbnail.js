import { Box } from '@mui/material';

function TypogarphyThumbnail({ text, previewStyle }) {
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

export default TypogarphyThumbnail;
