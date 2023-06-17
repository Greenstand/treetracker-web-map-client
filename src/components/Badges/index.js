import { Chip } from '@mui/material';
import { makeStyles } from 'models/makeStyles';

const useStyles = makeStyles()(() => ({
  root: {
    '&.Mui-disabled': {
      opacity: 1,
    },
  },
}));

function Badges({ content }) {
  const { classes } = useStyles();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    (<>
      {content?.map((data, index) => {
        const {
          color,
          badgeName,
          onClick = null,
          disabled = false,
          icon = null,
        } = data;
        return (
          <Chip
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            color={color}
            className={classes.root}
            sx={{
              borderRadius: 1,
              fontSize: 12,
              lineHeight: (t) => [t.spacing(4)],
              letterSpacing: '0.02em',
            }}
            size="small"
            icon={icon}
            label={badgeName}
            onClick={onClick}
            disabled={disabled}
          />
        );
      })}
    </>)
  );
}

export default Badges;
