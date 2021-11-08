import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ButtonBase } from '@mui/material';
import { makeStyles } from '@mui/material/styles';

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
