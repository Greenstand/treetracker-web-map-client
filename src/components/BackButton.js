import { Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
  backButton: {
    textTransform: 'none',
  },
}));

export default function BackButton() {
  const classes = useStyles();
  return (
    <Button
      className={classes.backButton}
      color="textPrimary"
      startIcon={<ArrowBackIosIcon />}
    >
      Back
    </Button>
  );
}
