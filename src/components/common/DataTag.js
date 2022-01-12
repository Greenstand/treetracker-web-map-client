import CalendarToday from '@mui/icons-material/CalendarToday';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Stack, Typography } from '@mui/material';

function DataTag({ data, location }) {
  return (
    <Stack
      gap={1}
      direction="row"
      sx={{
        alignItems: 'center',
        color: 'textLight.main',
        opacity: 0.6,
      }}
    >
      {location ? (
        <LocationOnOutlinedIcon sx={{ fontSize: '1.25rem' }} />
      ) : (
        <CalendarToday sx={{ fontSize: '1.25rem' }} />
      )}
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {!location && `Planter since`} {data}
      </Typography>
    </Stack>
  );
}

export default DataTag;
