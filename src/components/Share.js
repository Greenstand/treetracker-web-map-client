import Close from '@mui/icons-material/Close';
import Code from '@mui/icons-material/Code';
import Email from '@mui/icons-material/Email';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Typography } from '@mui/material';
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
import React from 'react';
import { useClipboard } from 'hooks/globalHooks';
import CustomShareIcon from './common/CustomShareIcon';

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: theme.palette.secondary.lightGreen,
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
  const { onCopy, hasCopied } = useClipboard(link);

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

  function handleMessageClose() {
    setMessageOpen(false);
    setMessage('');
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
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: [2, 4],
            m: [1, 2],
            p: [6, 8],
          },
        }}
        sx={{
          zIndex: 9999,
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
          }}
        >
          <Box
            sx={{
              p: 0,
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              Share this link
            </Typography>
            <IconButton className={classes.closeIcon} onClick={handleClose}>
              <Close style={{ color: green[500] }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <Box
          sx={{
            gap: 4,
            justifyContent: 'center',
            display: 'flex',
            p: [2, 4],
          }}
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
        </Box>
        <Typography
          sx={{
            py: [1, 2],
          }}
        >
          or copy the link
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <TextField
            value={link}
            sx={{
              flex: '1',
            }}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
        </Box>
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
          <Button onClick={onCopy}>Copy</Button>
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
