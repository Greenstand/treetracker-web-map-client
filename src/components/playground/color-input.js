import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { propRules } from '../../models/themePlaygroundOptions';

function ColorInput(props) {
  const { label, initial, onChange } = props;
  const [value, setValue] = useState(initial);
  const [isValid, setValid] = useState(true);
  const isGradient = /gradient/i.test(label);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!isGradient) if (!propRules.color.test(userValue)) return;
    setValid(true);
    onChange({ propName: label, newValue: userValue });
  };

  return (
    <Box
      sx={{
        flex: '1',
      }}
    >
      <TextField
        variant="standard"
        error={!isValid}
        multiline={isGradient}
        label={label}
        value={value}
        onChange={handleChange}
        sx={{
          textTransform: 'capitalize',
          width: 1,
        }}
        helperText={!isValid && 'Invalid syntax'}
      />
    </Box>
  );
}

export default ColorInput;
