import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import BackButton from './BackButton';
import SearchButton from './SearchButton';

const useStyles = makeStyles(() => ({
  pageContainer: {
    margin: '12px 24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  main: {
    width: '100%',
    flexGrow: 1,
  },
}));

export default function PageWrapper({ children, className, ...otherProps }) {
  const classes = useStyles();
  return (
    <Box className={classes.pageContainer}>
      <Box className={classes.top}>
        <BackButton />
        <SearchButton />
      </Box>
      <Box className={clsx(classes.main, className)} {...otherProps}>
        {children}
      </Box>
    </Box>
  );
}
