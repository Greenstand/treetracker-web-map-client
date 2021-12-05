import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '../../models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    minWidth: 275,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    cursor: 'pointer',
  },
}));

const CustomCard = (props) => {
  const { classes } = useStyles(props);
  const theme = useTheme();
  const { icon, title, text, handleClick, disabled } = props;

  return (
    <Card
      className={classes.root}
      onClick={handleClick}
      elevation={0}
      sx={{
        background: disabled
          ? theme.palette.grey[300]
          : theme.palette.background.greenGradient,
      }}
    >
      <CardMedia sx={{ padding: theme.spacing(4) }}>
        <Avatar
          sx={{
            height: 60,
            width: 60,
            boxShadow: disabled ? '' : '0px 6px 12px 0px #585B5D40',
            backgroundColor: 'white',
            color: disabled ? 'textSecondary.main' : 'secondary.main',
          }}
        >
          {icon}
        </Avatar>
      </CardMedia>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}
      >
        <Typography variant="body1" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h2">{text}</Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
