import Code from '@mui/icons-material/Code';
import Email from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  gridContainer: {
    padding: theme.spacing(2),
  },
}));

function ShareIcon(props) {
  const { classes } = useStyles();

  return (
    <Grid item className={classes.gridContainer}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <IconButton name={props.name} onClick={props.clickHandler}>
            {(() => {
              switch (props.iconSrc) {
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
                  return <Avatar src={props.iconSrc} />;
              }
            })()}
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="button">{props.name}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ShareIcon;
