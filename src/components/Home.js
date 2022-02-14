import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';
import useEmbed from '../hooks/useEmbed';

const backgroundImage = '/images/bg.png';
const useStyles = makeStyles()((theme) => ({
  pageContainer: {
    background: `center / cover no-repeat url(${backgroundImage})`,
    backgroundPosition: 'inherit',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      backgroundPosition: 'center',
    },
  },
  contentContainer: {
    color: 'white',
    lineHeight: '140%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      boxSizing: 'border-box',
    },
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    fontFamily: 'Lato',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: theme.spacing(4.75),
    letterSpacing: '0.04em',
    textAlign: 'left',
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4, 6),
    [theme.breakpoints.down('sm')]: {
      letterSpacing: '0.02em',
      padding: theme.spacing(3.5, 4.25),
    },
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const isEmbed = useEmbed();

  if (isEmbed) {
    return null;
  }

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
          width: (t) => [t.spacing(83), t.spacing(128)],
          mt: [-71, 30],
        }}
        className={classes.contentContainer}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: [16, 20],
            fontWeight: 700,
            lineHeight: (t) => [t.spacing(6.4), t.spacing(7)],
          }}
        >
          Welcome to TreeTracker
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: [32, 48],
            fontWeight: [600, 700],
            lineHeight: (t) => [t.spacing(11.2), t.spacing(16.8)],
            letterSpacing: 0,
          }}
        >
          Come explore the global reforestation effort.
        </Typography>
        <Box
          className={classes.buttonsContainer}
          sx={{
            mt: (t) => [t.spacing(6.5), t.spacing(10)],
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
                ml: [4, 6],
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
