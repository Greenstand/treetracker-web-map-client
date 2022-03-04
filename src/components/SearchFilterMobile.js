import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import log from 'loglevel';
import { useRouter } from 'next/router';
import React from 'react';
import Link from './Link';
import Filter from './common/Filter';

export default function SearchFilter() {
  const [keyword, setKeyword] = React.useState('');
  const [filterText, setFilterText] = React.useState('');
  const [keywordPlaceholder, setKeywordPlaceholder] = React.useState('Search');
  const [mode, setMode] = React.useState('search');
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function embedPath() {
    const url = new URL(window.location.href);
    let path = '';
    if (url.searchParams.get('embed')) {
      path = '&embed=true';
    }
    return path;
  }

  function handleSearchClick() {
    // jump to search page using next router
    router.push(`/search?keyword=${keyword}${embedPath()}`);
  }

  function handleChange(e) {
    setKeyword(e.target.value);
  }

  function handleFilter(filter) {
    log.warn('handle filter:', filter);
    router.push(
      `/filter?timeline=${filter.startDate}_${filter.endDate}${embedPath()}`,
    );
    setIsFilterOpen(false);
  }

  function handleDropDownClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleModeClick(mode2) {
    setMode(mode2);
    setAnchorEl(null);
  }

  function handleOpenFilter() {
    setIsFilterOpen(!isFilterOpen);
  }

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const keyword2 = url.searchParams.get('keyword');
    if (keyword2) {
      setKeywordPlaceholder(keyword2);
      setMode('search');
    }
    const timeline = url.searchParams.get('timeline');
    if (timeline) {
      setFilterText(`timeline:${timeline}`);
      setMode('filter');
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
      {mode === 'search' && (
        <>
          <Box>
            <input
              placeholder={keywordPlaceholder}
              onChange={handleChange}
              value={keyword}
              type="text"
            />
          </Box>
          <Button onClick={handleSearchClick}>Search</Button>
        </>
      )}
      {mode === 'filter' && (
        <>
          <Box onClick={handleOpenFilter}>
            <Typography variant="h6">{filterText}</Typography>
          </Box>
          {isFilterOpen && (
            <Filter isFilterOpenInitial onFilter={handleFilter} />
          )}
        </>
      )}
      <ArrowDropDownIcon onClick={handleDropDownClick} />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleModeClick('search')}>Search</MenuItem>
        <MenuItem onClick={() => handleModeClick('filter')}>Filter</MenuItem>
      </Menu>
    </Box>
  );
}
