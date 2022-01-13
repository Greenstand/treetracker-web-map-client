import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';

const backgroundImage = '/images/bg.png';
const useStyles = makeStyles()((theme) => ({
  pageContainer: {
    background: `center / cover no-repeat url(${backgroundImage})`,
    height: '100%',
  },
  contentContainer: {
    width: '75%',
    margin: '0 auto',
    color: 'white',
    height: '100%',
    lineHeight: '140%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '15vh',
    '&>*': {
      marginBottom: theme.spacing(5),
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      padding: '1rem',
      paddingTop: '15vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    textTransform: 'none',
    marginRight: 20,
  },
}));

function Buttons() {
  const { classes } = useStyles();
  return (
    <Box className={classes.buttonsContainer} mt={4.5}>
      <Button variant="outlined" color="inherit" className={classes.button}>
        <Typography>Learn more</Typography>
      </Button>
      <Link href="/top">
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
        >
          <Typography sx={{ color: 'textPrimary.main' }}>
            Let&apos;s Find a Tree
          </Typography>
        </Button>
      </Link>
    </Box>
  );
}

export default function Home() {
  const { classes } = useStyles();

  return (
    <Box className={classes.pageContainer}>
      <Box className={classes.contentContainer}>
        <Typography variant="h3">Welcome to TreeTracker</Typography>
        <Typography variant="h1">
          Come explore the global reforestation effort.
        </Typography>
        <Buttons />
        <Box sx={{ height: 1000 }} />
      </Box>
    </Box>
  );
}
