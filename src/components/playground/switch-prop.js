import {
  ListItem,
  ListItemText,
  Typography,
  Stack,
  Switch,
} from '@mui/material';

function SwitchProp(props) {
  const { prop, optionA, optionB, initial, onChange } = props;
  const isB = initial === optionB;

  const handleChange = () => {
    const value = isB ? optionA : optionB;
    onChange(value);
  };

  return (
    <ListItem
      sx={{
        justifyContent: 'space-between',
      }}
    >
      <ListItemText
        sx={{
          textTransform: 'capitalize',
        }}
      >
        {prop}
      </ListItemText>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          color={isB ? 'textSecondary' : 'textPrimary'}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {optionA}
        </Typography>
        <Switch checked={isB} onClick={handleChange} color="default" />
        <Typography
          variant="body2"
          color={!isB ? 'textSecondary' : 'textPrimary'}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {optionB}
        </Typography>
      </Stack>
    </ListItem>
  );
}

export default SwitchProp;
