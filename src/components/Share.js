import Close from '@mui/icons-material/Close';
import Code from '@mui/icons-material/Code';
import Email from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { green } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';
import log from 'loglevel';
import React from 'react';
import CustomShareIcon from './common/CustomShareIcon';

const useStyles = makeStyles((theme) => ({
  DialogTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
    },
  },
  closeIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: theme.palette.secondary.lightGreen,
  },
  box1: {
    padding: theme.spacing(4),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  code: {
    minWidth: 400,
    margin: 10,
  },
  linkText: {
    fontWeight: 'bold',
  },
  inputField: {
    width: '100%',
    height: '30px',
    border: 'none',
    borderRadius: '4px',
    padding: '8px',
    marginTop: '8px',
    backgroundColor: '#F5F5F5',
  },
}));

function Share({ shareUrl }) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEmbedOpen, setEmbedOpen] = React.useState(false);
  const [embedCode, setEmbedCode] = React.useState('');
  const [isMessageOpen, setMessageOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleClick() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&via=green_stand&related=Greestand,treetracker`,
    );
  }

  function handleFaceBook() {
    window.open(
      `https://www.facebook.com/dialog/share?app_id=87741124305&href=${shareUrl}&display=popup`,
    );
  }

  const mailString = `mailto:?subject=A tree from Greenstand&body=I want to share this tree from Greenstand with you, please click this link to check it! ${shareUrl}`;

  function handleEmbed() {
    setIsOpen(false);
    setEmbedOpen(true);
  }

  function handleEmbedClose() {
    setEmbedOpen(false);
  }

  function handleChange(e) {
    setEmbedCode(e.target.value);
  }

  React.useEffect(() => {
    setEmbedCode(
      `<iframe width="560" height="315" src="${shareUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    );
    setLink(`${shareUrl}`);
  }, [shareUrl]);

  function showMessage(text) {
    setMessage(text);
    setMessageOpen(true);
  }

  function handleCopy() {
    log.log('copy...');
    const copyTextarea = document.getElementById('EmbedCode');
    copyTextarea.focus();
    copyTextarea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      log.log(`Copying text command was ${msg}`);
    } catch (err) {
      log.log('Oops, unable to copy');
    }
    showMessage('Code has been copied!');
  }

  function handleMessageClose() {
    setMessageOpen(false);
    setMessage('');
  }

  return (
    <>
      <Tooltip title="share tree">
        <IconButton onClick={handleClick}>
          <ShareIcon style={{ color: green[500] }} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            margin: '8px',
          },
        }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={8} className={classes.DialogTitle}>
              Share this token
            </Grid>
            <Grid item>
              <IconButton
                className={classes.closeIcon}
                onClick={handleClose}
                size="large"
              >
                <Close style={{ color: green[500] }} />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Grid container justifyContent="center" className={classes.box1}>
          <CustomShareIcon handleOnClick={handleEmbed}>
            <Code />
          </CustomShareIcon>
          <CustomShareIcon handleOnClick={handleFaceBook}>
            <FacebookIcon />
          </CustomShareIcon>
          <CustomShareIcon handleOnClick={handleTwitter}>
            <TwitterIcon />
          </CustomShareIcon>
          <CustomShareIcon mailString={mailString}>
            <Email />
          </CustomShareIcon>

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={8} className={classes.linkText}>
              Or this link
            </Grid>
            <Grid item xs={12}>
              <input type="text" className={classes.inputField} value={link} />
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
      <Dialog open={isEmbedOpen} onClose={handleEmbedClose}>
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={8}>
              Embed Greenstand
            </Grid>
            <Grid item>
              <IconButton onClick={handleEmbedClose} size="large">
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <TextField
          id="EmbedCode"
          multiline
          variant="outlined"
          value={embedCode}
          maxRows={4}
          onChange={handleChange}
          className={classes.code}
        />
        <DialogActions>
          <Button onClick={handleEmbedClose}>Cancel</Button>
          <Button onClick={handleCopy}>Copy</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isMessageOpen}
        autoHideDuration={6000}
        onClose={handleMessageClose}
        message={message}
        action={
          <IconButton color="primary" onClick={handleMessageClose} size="large">
            <Close />
          </IconButton>
        }
      />
    </>
  );
}

export default Share;
