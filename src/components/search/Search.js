import Box from '@mui/material/Box';
import { useState } from 'react';
import SearchDialog from './SearchDialog';
import SearchInput from './SearchInput';

export default function Search() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  return (
    <Box
      sx={{
        position: 'relative',
        margin: '20px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '480px',
          height: '80px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
        }}
      />
      <SearchInput
        keyword={searchKeyword}
        setKeyword={setSearchKeyword}
        setResults={setSearchResults}
      />
      <SearchDialog results={searchResults} />
    </Box>
  );
}
