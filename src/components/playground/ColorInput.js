import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { usePlaygroundUtils } from '../../context/playgroundContext';
import { propRules } from '../../models/themePlaygroundOptions';

function ColorInput(props) {
  const { path, label, onChange } = props;
  const { getPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [isValid, setValid] = useState(true);
  const isGradient = /gradient/i.test(label);

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
