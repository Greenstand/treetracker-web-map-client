import Code from '@mui/icons-material/Code';
import Email from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  gridContainer: {
    padding: theme.spacing(2),
  },
}));

function ShareIcon(props) {
  const { classes } = useStyles();
  const { name, clickHandler, iconSrc } = props;

  return (
    <Grid item className={classes.gridContainer}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <IconButton name={name} onClick={clickHandler}>
            {(() => {
              switch (iconSrc) {
                case 'Embed':
                  return (
                    <Avatar>
                      <Code />
                    </Avatar>
                  );
                case 'Email':
                  return (
                    <Avatar>
                      <Email />
                    </Avatar>
                  );
                case 'Link':
                  return (
                    <Avatar>
                      <LinkIcon />
                    </Avatar>
                  );
                default:
                  return <Avatar src={iconSrc} />;
              }
            })()}
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="button">{name}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ShareIcon;
