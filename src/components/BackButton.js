import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles(() => ({
  backButton: {
    textTransform: 'none',
    fontSize: 16,
    lineHeight: '16px',
    color: '#6B6E70',
  },
  icon: {
    marginRight: -4,
  },
}));

export default function BackButton() {
  const classes = useStyles();
  return (
    <ButtonBase className={classes.backButton} color="textPrimary">
      <ArrowBackIosIcon fontSize="inherit" className={classes.icon} />
      Back
    </ButtonBase>
  );
}
