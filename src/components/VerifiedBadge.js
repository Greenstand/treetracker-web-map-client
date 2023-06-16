import CheckIcon from '@mui/icons-material/Check';
import { Chip } from '@mui/material';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()(() => ({
  root: {
    '&.Mui-disabled': {
      opacity: 1,
    },
  },
}));

function VerifiedBadge({ verified, badgeName, color, onClick, disabled }) {
    const { classes } = useStyles();
  return (
    <Chip
      color={color}
      className={classes.root}
      sx={{
        borderRadius: 1,
        fontSize: 12,
        lineHeight: (t) => [t.spacing(4)],
        letterSpacing: '0.02em',
      }}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export default VerifiedBadge;
