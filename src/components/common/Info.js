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
          maxWidth: 16,
          maxHeight: 16,
        },
      }}
    >
      <Icon
        icon={iconURI}
        sx={{
          '& path': {
            fill: ({ palette }) => palette.text.text2,
          },
        }}
      />
      <Typography variant="h6">{info}</Typography>
    </Box>
  );
}
