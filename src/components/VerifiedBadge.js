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

function VerifiedBadge({ verified, badgeName }) {
  const { classes } = useStyles();
  return (
    <Chip
      color="primary"
      className={classes.root}
      sx={{
        bgcolor: verified ? 'primary.main' : 'textLight.main',
        color: 'common.white',
        borderRadius: 1,
        fontSize: 12,
        lineHeight: (t) => [t.spacing(4)],
        letterSpacing: '0.02em',
      }}
      size="small"
      icon={!verified ? null : <CheckIcon />}
      label={badgeName}
      disabled={!verified}
    />
  );
}

export default VerifiedBadge;
