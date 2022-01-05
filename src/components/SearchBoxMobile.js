import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase } from '@mui/material';
import React from 'react';

export default function SearchBox() {
  return (
    <Box>
      <InputBase
        sx={{
          height: '44px',
          width: '356px',
          borderRadius: '50px',
          paddingLeft: '20px',
          background: '#FFFFFF',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.25)',
          fontSize: 'small',
        }}
        type="search"
        placeholder="Enter a tree ID, tree species, or location"
        variant="outlined"
        endAdornment={
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        }
      />
    </Box>
  );
}
