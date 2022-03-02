import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';

export default function SearchButton() {
  return (
    <Fab aria-label="search" sx={{ height: 48, width: 48 }} color="primary">
      <SearchIcon fontSize="large" />
    </Fab>
  );
}
