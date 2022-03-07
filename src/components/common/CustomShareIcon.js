import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { green } from '@mui/material/colors';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  box2: {
    [theme.breakpoints.down('sm')]: {
      width: '25%',
    },
  },
  avatar: {
    color: green[500],
    backgroundColor: theme.palette.secondary.lightGreen,
    width: '64px',
    height: '64px',
  },
  iconButton: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  },
}));

function CustomShareIcon({ handleOnClick, children, mailString }) {
  const { classes } = useStyles();

  return (
    <Grid item className={classes.box2}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <IconButton
            className={classes.iconButton}
            onClick={handleOnClick}
            size="large"
          >
            {mailString ? (
              <a href={mailString}>
                <Avatar className={classes.avatar}>{children}</Avatar>
              </a>
            ) : (
              <Avatar className={classes.avatar}>{children}</Avatar>
            )}
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CustomShareIcon;
