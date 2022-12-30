import { IconButton } from '@mui/material';

function CustomShareIcon({ handleOnClick, children, mailString }) {
  const button = (
    <IconButton
      sx={{
        color: (t) => t.palette.primary,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: [56, 64],
        height: [56, 64],
        '& svg': {
          width: [28, 32],
          height: [28, 32],
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
      }}
      onClick={handleOnClick}
    >
      {children}
    </IconButton>
  );

  if (mailString) {
    return (
      <a href={mailString} target="_blank" rel="noreferrer">
        {button}
      </a>
    );
  }
  return button;
}

export default CustomShareIcon;
