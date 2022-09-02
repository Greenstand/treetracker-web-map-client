import { Box } from '@mui/material';

function UUIDTag({ uuid, sx }) {
  const formattedId = `${uuid.slice(0, 4)}...${uuid.slice(
    uuid.length - 4,
    uuid.length,
  )}`;

  return (
    <Box component="span" sx={sx}>
      {formattedId}
    </Box>
  );
}

export default UUIDTag;
