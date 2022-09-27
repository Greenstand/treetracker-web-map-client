import { Box, Typography } from '@mui/material';
import Icon from './CustomIcon';

export default function Info({ info, iconURI }) {
  return (
    <Box
      sx={{
        color: 'text.text2',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        '& svg': {
          filter: 'opacity(0.5)',
          maxWidth: 16,
          maxHeight: 16,
        },
      }}
    >
      <Icon icon={iconURI} />
      <Typography variant="h6">{info}</Typography>
    </Box>
  );
}
