import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useDashboardContext } from 'context/dashboardContext';
import { updateLogoUrl } from 'models/config.reducer';

function CustomLogo() {
  const { state, dispatch } = useDashboardContext();

  const handleOnChange = (e) => {
    const newUrl = e.target.value;
    dispatch(updateLogoUrl(newUrl));
  };

  // New input for file uploading instead of URL
  // return (
  //   <Box>
  //     <Button
  //       variant="contained"
  //       component="label"
  //       sx={{
  //         py: 1,
  //         px: 2,
  //       }}
  //     >
  //       Upload Logo
  //       <input
  //         type="file"
  //         filename={state.navbar.logoUrl}
  //         onChange={handleOnChange}
  //         hidden
  //       />
  //     </Button>
  //   </Box>
  // );

  return (
    <Stack spacing={2} direction="row">
      <TextField
        variant="outlined"
        placeholder="Enter Logo Link"
        value={state.navbar.logoUrl}
        onChange={handleOnChange}
        sx={{
          flex: 1,
          maxWidth: '500px',
        }}
      />
      <Button variant="contained">Save</Button>
    </Stack>
  );
}

export default CustomLogo;
