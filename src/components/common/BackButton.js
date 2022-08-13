import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BackButton() {
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIosIcon />}
        variant="text"
        color="notImportant"
      >
        Back
      </Button>
    </Box>
  );
}
