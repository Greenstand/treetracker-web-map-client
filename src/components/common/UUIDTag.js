import { Box, Tooltip, Typography } from '@mui/material';
import { useClipboard } from '../../hooks/globalHooks';

function UUIDTag({ uuid, sx }) {
  const formattedId = `${uuid.slice(0, 4)}...${uuid.slice(
    uuid.length - 4,
    uuid.length,
  )}`;

  const { onCopy, hasCopied } = useClipboard(uuid);

  const title = (
    <>
      <Typography
        sx={{
          fontSize: '1.2em',
          py: 1,
          px: 2,
          borderRadius: 2,
          background: 'rgba(97, 97, 97, 0.92)',
        }}
      >
        {uuid}
      </Typography>
      <Box
        component="span"
        sx={{
          background: ({ palette }) => palette.primary.main,
          text: ({ palette }) => palette.text.primary,
          p: 1,
          ml: 1,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onCopy}
      >
        <Typography sx={{ fontSize: '1.2em' }}>
          {hasCopied ? 'copied!' : 'copy'}
        </Typography>
      </Box>
    </>
  );

  return (
    <Tooltip
      title={title}
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            maxWidth: 'none',
            background: 'none',
            display: 'flex',
            justifyContent: 'space-between',
          },
        },
      }}
    >
      <Box component="span" sx={sx}>
        {formattedId}
      </Box>
    </Tooltip>
  );
}

export default UUIDTag;
