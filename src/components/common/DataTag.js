import CalendarToday from '@mui/icons-material/CalendarToday';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Stack, Typography } from '@mui/material';

function DataTag({ data, location, color }) {
  return (
    <Stack
      gap={1}
      direction="row"
      sx={{
        alignItems: 'center',
        opacity: 0.6,
      }}
    >
      {location ? (
        <LocationOnOutlinedIcon
          sx={{
            fontSize: '1.25rem',
            color: color ? 'grey.main' : 'text.disabled',
          }}
        />
      ) : (
        <CalendarToday
          sx={{
            fontSize: '1.25rem',
            color: color ? 'grey.main' : 'text.disabled',
          }}
        />
      )}
      <Typography
        variant="body1"
        color={color ? 'grey.main' : ''}
        sx={{
          fontWeight: 700,
          lineHeight: (t) => [t.spacing(4.2), t.spacing(5.625)],
        }}
      >
        {!location && `Planter since`} {data}
      </Typography>
    </Stack>
  );
}

export default DataTag;
