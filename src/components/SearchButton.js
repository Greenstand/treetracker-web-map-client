import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  fab: {
    height: 48,
    width: 48,
  },
  icon: {
    color: '#6B6E70',
  },
}));

export default function SearchButton() {
  const classes = useStyles();
  return (
    <Fab aria-label="search" color="primary" className={classes.fab}>
      <SearchIcon fontSize="large" className={classes.icon} />
    </Fab>
  );
}
