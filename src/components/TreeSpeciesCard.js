import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    boxSizing: 'border-box',
    borderRadius: theme.spacing(4),
    border: '1px solid',
    borderColor: theme.palette.textLight.main,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  countBox: {
    background: theme.palette.textLight.main,
    padding: theme.spacing(6, 8),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(5.75, 7.5),
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function TreeSpeciesCard(props) {
  const { classes } = useStyles();

  const { name, count } = props;

  return (
    <Card className={classes.root} elevation={0}>
      <Box ml={6}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Lato',
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>
      </Box>
      <Box className={classes.countBox}>
        <Typography variant="body1" color="common.white">
          Count:
        </Typography>
        <Typography
          variant="h3"
          color="common.white"
          sx={{
            fontFamily: 'Lato',
            fontWeight: 700,
            fontSize: [24, 32],
            letterSpacing: '0.04em',
            lineHeight: (t) => [t.spacing(7.25), t.spacing(9.5)],
            mt: [1, 2],
          }}
        >
          {count}
        </Typography>
      </Box>
    </Card>
  );
}

export default TreeSpeciesCard;
