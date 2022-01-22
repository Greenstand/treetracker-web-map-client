import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';

const backgroundImage = '/images/bg.png';
const useStyles = makeStyles()((theme) => ({
  pageContainer: {
    background: `center / cover no-repeat url(${backgroundImage})`,
    backgroundPosition: 'inherit',
    height: '100%',
  },
  contentContainer: {
    margin: '0 auto',
    color: 'white',
    lineHeight: '140%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    fontFamily: 'Lato',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '19px',
    letterSpacing: '0.04em',
    textAlign: 'left',
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4, 6),
  },
}));

export default function Home() {
  const { classes } = useStyles();

  return (
    <Box
      className={classes.pageContainer}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 1,
      }}
    >
      <Box
        sx={{
          width: (t) => t.spacing(128),
        }}
        className={classes.contentContainer}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: [16, 20],
            fontWeight: 700,
            lineHeight: (t) => [t.spacing(25.6), t.spacing(7)],
          }}
        >
          Welcome to TreeTracker
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: 48,
            fontWeight: 700,
            lineHeight: (t) => [t.spacing(16.8)],
            letterSpacing: 0,
          }}
        >
          Come explore the global reforestation effort.
        </Typography>
        <Box
          className={classes.buttonsContainer}
          sx={{
            mt: (t) => t.spacing(10),
          }}
        >
          <Button variant="outlined" color="inherit" className={classes.button}>
            Learn more
          </Button>
          <Link href="/top">
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              sx={{
                color: '#474B4F',
                ml: (t) => t.spacing(6),
              }}
            >
              Let&apos;s Find a Tree
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
