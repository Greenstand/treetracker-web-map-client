import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import Link from './Link';

export default function SearchFilter() {
  const [keyword, setKeyword] = React.useState('');
  const [keywordPlaceholder, setKeywordPlaceholder] = React.useState('Search');
  const router = useRouter();

  function handleSearchClick() {
    // jump to search page using next router
    router.push(`/search?keyword=${keyword}`);
  }

  function handleChange(e) {
    setKeyword(e.target.value);
  }

  function handleFilterClick() {
    // setMode("filter");
    router.push(`/filter`);
  }

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const keyword2 = url.searchParams.get('keyword');
    if (keyword2) {
      setKeywordPlaceholder(keyword2);
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // width: '688px',
        // height: '48px',
        // left: '16px',
        // top: '97px',
        // background: '#FFFFFF',
        // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        // borderRadius: '50px',
        border: '1px solid #E0E0E0',
      }}
    >
      {keywordPlaceholder && (
        <Box sx={{}}>
          <Link href={`/search?keyword=${keywordPlaceholder}`}>Back</Link>
        </Box>
      )}
      <Box>
        <input
          placeholder={keywordPlaceholder}
          onChange={handleChange}
          value={keyword}
          type="text"
        />
      </Box>
      <Button onClick={handleSearchClick}>Search</Button>|
      <Button onClick={handleFilterClick}>Filter</Button>
    </Box>
  );
}
