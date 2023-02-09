import { Alert, Snackbar } from '@mui/material';
import { ConfigProvider, useConfigContext } from 'context/configContext';
import { updateNoticeVisible } from 'models/config.reducer';

function SnackbarMessage() {
  const { state, dispatch } = useConfigContext();
  const {globalMessage} = state;

  function handleClose(reason) {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(updateNoticeVisible(false));
  }
  return (
    <Snackbar
      open={globalMessage.visible}
      id="GlobalMessage"
      onClose={handleClose}
    >
      <Alert
        open={globalMessage.visible}
        onClose={handleClose}
        severity={globalMessage.severity}
        sx={{ width: '100%' }}
      >
        {globalMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default function GlobalNotification() {
  // In order to toggle GlobalNotification's visibility,
  // dispatch the action 'updateNoticeVisible'.

  return (
    <ConfigProvider>
      <SnackbarMessage />
    </ConfigProvider>
  );
}
