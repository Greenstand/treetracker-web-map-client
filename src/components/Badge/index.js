import { Chip } from '@mui/material';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()(() => ({
  root: {
    '&.Mui-disabled': {
      opacity: 1,
    },
  },
}));

function Badge(props) {
  const { classes } = useStyles();

  const {
    color,
    badgeName,
    onClick = null,
    disabled = false,
    icon = null,
  } = props;

  return (
    <Chip
      color={color}
      className={classes.root}
      sx={{
        borderRadius: 1,
        fontSize: 12,
        lineHeight: (t) => [t.spacing(4)],
        letterSpacing: '0.02em',
      }}
      size="small"
      icon={icon}
      label={badgeName}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export default Badge;
