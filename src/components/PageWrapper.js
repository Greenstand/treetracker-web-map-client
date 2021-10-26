import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import BackButton from './BackButton';
import SearchButton from './SearchButton';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    background: 'white',
    padding: '12px 20px',
  },
}));

export default function PageWrapper({ children }) {
  const classes = useStyles();
  return (
    <Box className={classes.pageContainer}>
      <Box display="flex" justifyContent="spaceBetween">
        <BackButton />
        <SearchButton />
      </Box>
      {children}
    </Box>
  );
}
