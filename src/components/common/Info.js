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
      }}
    >
      <Icon
        icon={iconURI}
        size={[16, 16]}
        sx={{
          filter: 'opacity(0.5)',
        }}
      />
      <Typography variant="h6">{info}</Typography>
    </Box>
  );
}
