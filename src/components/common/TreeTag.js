import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';
import Link from '../Link';

function TreeTagComponent({
  TreeTagValue,
  title,
  subtitle,
  icon,
  disabled = false,
  link,
  fullWidth = false,
}) {
  const chip = (
    <Chip
      sx={{
        bgcolor: (t) =>
          disabled
            ? d3
                .color(t.palette.greyLight.main)
                .copy({ opacity: 0.05 })
                .formatRgb()
            : t.palette.mode === 'light'
            ? d3
                .color(t.palette.secondary.main)
                .copy({ opacity: 0.05 })
                .formatRgb()
            : d3
                .color(t.palette.secondary.main)
                .copy({ opacity: 0.5 })
                .formatRgb(),
        // hover
        '&:hover': {
          bgcolor: (t) =>
            disabled
              ? d3
                  .color(t.palette.greyLight.main)
                  .copy({ opacity: 0.1 })
                  .formatRgb()
              : t.palette.mode === 'light'
              ? d3
                  .color(t.palette.secondary.main)
                  .copy({ opacity: 0.1 })
                  .formatRgb()
              : d3
                  .color(t.palette.secondary.main)
                  .copy({ opacity: 0.6 })
                  .formatRgb(),
        },
        borderColor: disabled ? 'greyLight.main' : 'secondary.main',
        borderWidth: '1px',
        borderStyle: 'solid',
        p: (t) => [t.spacing(2, 2), t.spacing(4.75, 6)],
        height: 'auto',
        maxHeight: [58.6, 87.2],
        ...(fullWidth && {
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '540px',
        }),
      }}
      color="secondary"
      icon={
        <Box
          sx={{
            '& svg': {
              width: [20, 24],
              height: [20, 24],
            },
          }}
          m={1}
        >
          {icon}
        </Box>
      }
      label={
        <Box
          sx={{
            ml: [2, 6],
          }}
        >
          <Typography variant="body1">{title}</Typography>
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
            variant="body2"
          >
            {TreeTagValue}
          </Typography>
          {subtitle && (
            <Typography sx={{}} variant="caption">
              {subtitle}
            </Typography>
          )}
        </Box>
      }
    />
  );
  return (
    <>
      {link && (
        <Box
          sx={{
            // mouse pointer
            '& div': {
              cursor: 'pointer',
            },
          }}
        >
          <Link href={link}>{chip}</Link>
        </Box>
      )}
      {!link && chip}
    </>
  );
}

export default TreeTagComponent;
