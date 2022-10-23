import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';

function CustomLogo() {
  return (
    <Stack spacing={6} direction="row">
      <TextField
        variant="outlined"
        placeholder="Enter Logo Link"
        sx={{
          flex: 1,
          maxWidth: '500px',
        }}
      />
      <Button variant="contained" size="large">
        Save
      </Button>
    </Stack>
  );
}

export default CustomLogo;
