import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// const IsMobileScreen = styled(Box)(({ theme }) => ({
//   display: 'block',
//   [theme.breakpoints.down('md')]: {
//     display: 'none',
//   },
// }));
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
