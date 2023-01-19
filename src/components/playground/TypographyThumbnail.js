import { Box } from '@mui/material';
import { usePlaygroundTheme } from 'hooks/contextHooks';

function TypographyThumbnail({ text, path }) {
  const { getPropByPath } = usePlaygroundTheme();
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
