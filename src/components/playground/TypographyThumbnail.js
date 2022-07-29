import { Box } from '@mui/material';
import { usePlaygroundUtils } from '../../context/playgroundContext';

function TypographyThumbnail({ text, path }) {
  const { getPropByPath } = usePlaygroundUtils();
  const previewStyle = getPropByPath(path);

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
