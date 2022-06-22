/* eslint-disable @next/next/no-img-element */
import { Box, Typography } from '@mui/material';

export default function Info({ info, iconURI }) {
  return (
    <Box
      sx={{
        color: 'text.text2',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        '& img': {
          filter: 'opacity(0.5)',
          maxWidth: 16,
          maxHeight: 16,
        },
      }}
    >
      <img src={iconURI} alt="join time" />
      <Typography variant="h6">{info}</Typography>
    </Box>
  );
}
