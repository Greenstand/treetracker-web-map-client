import { Alert, Snackbar } from '@mui/material';
import { useEffect } from 'react';
import { ConfigProvider, useConfigContext } from 'context/configContext';
import { updateNoticeVisible } from 'models/config.reducer';

function SnackbarMessage() {
  const { state, dispatch } = useConfigContext();
  const { globalMessage } = state;

  function handleClose(reason) {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(updateNoticeVisible(false));
  }

  // Uncomment this useEffect to force visibility.
  // useEffect(() => {
  //   dispatch(updateNoticeVisible(true));
  // }, []);

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
        sx={{
          width: '100%',
          '& .MuiAlert-icon': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiAlert-action': {
            alignItems: 'center',
            paddingY: 0,
            paddingLeft: 0,
          },
          '& .MuiAlert-message': { fontSize: '12px' },
        }}
      >
        {globalMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default function GlobalNotification() {
  // Must refresh local storage if changes made on configContext.

  return (
    <ConfigProvider>
      <SnackbarMessage />
    </ConfigProvider>
  );
}
