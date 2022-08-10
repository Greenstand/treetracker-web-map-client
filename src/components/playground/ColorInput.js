import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { usePlaygroundUtils } from '../../hooks/contextHooks';
import { propRules } from '../../models/themePlaygroundOptions';

function ColorInput(props) {
  const { path, label } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [isValid, setValid] = useState(true);
  const isGradient = /gradient/i.test(label);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!isGradient) if (!propRules.color.test(userValue)) return;
    setValid(true);
    setPropByPath(path, userValue);
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
