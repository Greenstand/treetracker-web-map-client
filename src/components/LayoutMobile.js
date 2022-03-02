import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { makeStyles } from 'models/makeStyles';
import Drawer from './Drawer';
import SearchFilter from './SearchFilter';

const App = dynamic(() => import('./App'), { ssr: false });
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
  },
  left: {
    width: '50%',
    height: '100%',
    zIndex: 999,
    background: theme.palette.background.default,
    overflowY: 'auto',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  right: {
    width: '50%',
    zIndex: 998,
    background: 'gray',
    [theme.breakpoints.down('sm')]: {
      width: '0%',
    },
  },
  behind: {},
  above: {},
}));

export default function Layout({ children }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Navbar />
      <Box sx={{ position: 'relative', width: 1, height: 1 }}>
        <Box
          sx={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }}
        >
          <App />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <Drawer>{children}</Drawer>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
            display: 'flex',
            padding: '10px 10px',
            '&>div': {
              backgroundColor: 'white',
            },
          }}
        >
          <SearchFilter />
        </Box>
      </Box>
    </Box>
  );
}
