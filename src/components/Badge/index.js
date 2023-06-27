import { Chip } from '@mui/material';

function Badge(props) {
  
  const {
    color,
    badgeName,
    onClick = null,
    disabled = false,
    icon = null,
  } = props;

  return (
    <Chip
      color={color}
      sx={{
        borderRadius: 1,
        fontSize: 12,
        lineHeight: (t) => [t.spacing(4)],
        letterSpacing: '0.02em',
        '&.Mui-disabled': {
          opacity: 1,
        },
      }}
      size="small"
      icon={icon}
      label={badgeName}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export default Badge;
