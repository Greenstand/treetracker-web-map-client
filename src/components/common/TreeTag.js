import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import * as d3 from 'd3';

function TreeTagComponent({ TreeTagValue, title, icon, disabled = false }) {
  return (
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
        p: (t) => [t.spacing(3, 4), t.spacing(4.75, 6)],
        height: 'auto',
      }}
      color="secondary"
      icon={<Box m={1}>{icon}</Box>}
      label={
        <Box
          sx={{
            ml: [4, 6],
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
        </Box>
      }
    />
  );
}

export default TreeTagComponent;
