import Close from '@mui/icons-material/Close';
import Code from '@mui/icons-material/Code';
import Email from '@mui/icons-material/Email';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Typography, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { green } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';
import log from 'loglevel';
import React from 'react';
import CustomShareIcon from './common/CustomShareIcon';

const useStyles = makeStyles((theme) => ({
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

function Share(props) {
  const { icon, shareUrl } = props;
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
  }, []);

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
    // showMessage('Code has been copied!');
  }

  function handleMessageClose() {
    setMessageOpen(false);
    setMessage('');
  }

  function showMessage(text) {
    setMessage(text);
    setMessageOpen(true);
  }

  return (
    <>
      {icon && <Box onClick={handleClick}>{icon}</Box>}
      {!icon && (
        <IconButton onClick={handleClick}>
          <ShareIcon style={{ color: green[500] }} />
        </IconButton>
      )}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: [2, 4],
            m: [1, 2],
            p: [6, 8],
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
          }}
        >
          <Grid
            sx={{
              p: 0,
            }}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={8}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                Share this link
              </Typography>
            </Grid>
            <Grid item>
              <IconButton className={classes.closeIcon} onClick={handleClose}>
                <Close style={{ color: green[500] }} />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Grid
          sx={{
            gap: [2, 4],
          }}
          container
          justifyContent="center"
          className={classes.box1}
        >
          <CustomShareIcon handleOnClick={handleEmbed}>
            <Code />
          </CustomShareIcon>
          <CustomShareIcon handleOnClick={handleFaceBook}>
            <FacebookRoundedIcon />
          </CustomShareIcon>
          <CustomShareIcon handleOnClick={handleTwitter}>
            <TwitterIcon />
          </CustomShareIcon>
          <CustomShareIcon mailString={mailString}>
            <Email />
          </CustomShareIcon>

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={8} className={classes.linkText}>
              <Typography variant="body1">Or copy link</Typography>
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
