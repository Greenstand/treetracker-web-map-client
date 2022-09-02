import { Box, Tooltip, Typography } from '@mui/material';

function UUIDTag({ uuid, sx }) {
  const formattedId = `${uuid.slice(0, 4)}...${uuid.slice(
    uuid.length - 4,
    uuid.length,
  )}`;

  const title = (
    <Typography sx={{ fontSize: '1.2em', maxWidth: 'none' }}>{uuid}</Typography>
  );

  return (
    <Tooltip title={title}>
      <Box component="span" sx={sx}>
        {formattedId}
      </Box>
    </Tooltip>
  );
}

export default UUIDTag;
