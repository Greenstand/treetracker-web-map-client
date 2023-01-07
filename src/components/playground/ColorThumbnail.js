import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { usePlaygroundUtils } from 'hooks/contextHooks';

function ColorThumbnail({ path }) {
  const { getPropByPath } = usePlaygroundUtils();
  const themeColor = getPropByPath(path);
  const [color, setColor] = useState('');

  useEffect(() => {
    setColor(themeColor);
  }, [themeColor]);

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
