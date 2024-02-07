import Close from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()(() => ({
  closeIcon: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 99999,
  },
  icon: {
    width: 80,
    height: 'auto',
  },
}));

function ImageShower(props) {
  const { classes } = useStyles();
  const { open, onClose, title, src } = props;
  if (!open) {
    return null;
  }
  return (
    <>
      <Dialog open onClose={onClose}>
        <Image alt={title} src={src} layout="fill" />
      </Dialog>
      <IconButton className={classes.closeIcon} onClick={onClose}>
        <Close className={classes.icon} />
      </IconButton>
    </>
  );
}

export default ImageShower;
