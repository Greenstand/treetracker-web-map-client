import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4.875, 6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3.375, 3.875),
    },
    color: theme.palette.common.white,
    background: theme.palette.primary.main,
    borderRadius: theme.spacing(4),
    width: 'fit-content',
    letterSpacing: '0.02em',
    flexWrap: 'nowrap',
  },
}));

function TreeTagComponent({ TreeTagValue, title, icon }) {
  const { classes } = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item sx={{ pr: [2, 4] }}>
        {icon}
      </Grid>
      <Grid item>
        <Typography variant="body1">{title}</Typography>
        <Typography variant="h5" sx={{ fontFamily: 'Lato' }}>
          {TreeTagValue}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default TreeTagComponent;
