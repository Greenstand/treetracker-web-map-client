import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '../../models/makeStyles';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
  },
  avatar: {
    height: 60,
    width: 60,
    background: theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      height: 36,
      width: 36,
    },
    '& > svg': {
      [theme.breakpoints.down('md')]: {
        fontSize: '1.5rem',
      },
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    '&:last-child': {
      [theme.breakpoints.down('md')]: {
        paddingBottom: theme.spacing(2),
      },
    },
  },
}));

function CustomCard(props) {
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
      <CardMedia sx={{ padding: [theme.spacing(4, 3), theme.spacing(6)] }}>
        <Avatar
          className={classes.avatar}
          sx={{
            boxShadow: disabled ? '' : '0px 6px 12px 0px #585B5D40',
            color: disabled
              ? theme.palette.textLight.main
              : theme.palette.success.main,
          }}
        >
          {icon}
        </Avatar>
      </CardMedia>
      <CardContent className={classes.cardContent}>
        <Typography variant="body1" color="textSecondary">
          {title}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: [16, 36],
            fontFamily: 'Lato',
            lineHeight: ['19.2px', '43.2px'],
            letterSpacing: ['0.02em', 0],
          }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CustomCard;
