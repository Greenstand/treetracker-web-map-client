import { Box } from '@mui/material';
import { usePlaygroundUtils } from '../../context/playgroundContext';

function ColorThumbnail({ path }) {
  const { getPropByPath } = usePlaygroundUtils();
  const color = getPropByPath(path);

  return (
    <Box
      sx={{
        background: color,
        height: 1,
        width: '16px',
        border: '1px solid #333',
        ml: 0.5,
      }}
    />
  );
}

export default ColorThumbnail;