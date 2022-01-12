import { Box } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { makeStyles } from 'models/makeStyles';
import BackButton from './BackButton';
import SearchButton from './SearchButton';

const useStyles = makeStyles()((theme) => ({
  pageContainer: {
    padding: theme.spacing(3, 4),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '100%',
    boxSizing: 'border-box',
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
  const { classes } = useStyles();
  const router = useRouter();

  const onBackHandler = () => {
    router.back();
  };

  return (
    <Box className={classes.pageContainer}>
      <Box className={classes.top}>
        <BackButton onBackHandler={onBackHandler} />
        <SearchButton />
      </Box>
      <Box className={clsx(classes.main, className)} {...otherProps}>
        {children}
      </Box>
    </Box>
  );
}
