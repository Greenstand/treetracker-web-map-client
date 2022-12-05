import Box from '@mui/material/Box';
import { useState } from 'react';
import { useLocalStorage } from 'hooks/globalHooks';
import SearchDialog from './SearchDialog';
import SearchHistoryDialog from './SearchHistoryDialog';
import SearchInput from './SearchInput';

export default function Search() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [searchHistory, setRecentSearchHistory] = useLocalStorage(
    'recentSearches',
    JSON.stringify([]),
  );
  let historyArray = JSON.parse(searchHistory);

  // Show search history when the input field has user focus, the user hasn't typed a word and an entry exists in search history
  const showRecentSearchHistory = focus && isEmpty && historyArray.length > 0;

  const addToHistory = (result) => {
    // Prevent duplicate entries
    historyArray = historyArray.filter(
      (search) => search.content !== result.content,
    );

    const exceedHistoryLength = historyArray.length >= 6;

    // Limit number of entries in history
    if (exceedHistoryLength) historyArray.shift();

    historyArray.push(result);
    setRecentSearchHistory(JSON.stringify(historyArray));
  };

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
        setFocus={setFocus}
        setIsEmpty={setIsEmpty}
        onEnter={addToHistory}
      />
      {showRecentSearchHistory ? (
        <SearchHistoryDialog results={historyArray.reverse()} />
      ) : (
        <SearchDialog results={searchResults} onClick={addToHistory} />
      )}
    </Box>
  );
}
