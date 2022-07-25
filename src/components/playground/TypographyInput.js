import { Box, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import FontSelector from './FontSelector';
import { usePlaygroundUtils } from '../../context/playgroundContext';
import { propRules } from '../../models/themePlaygroundOptions';

function TypographyInput(props) {
  const { path, label } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!propRules[label].test(userValue)) return;
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
        label={label}
        value={value}
        onChange={handleChange}
        sx={{
          textTransform: 'capitalize',
          width: 1,
        }}
        helperText={!isValid && 'Invalid syntax'}
        InputProps={{
          endAdornment: label === 'fontFamily' && (
            <InputAdornment position="end">
              <FontSelector handleChange={(val) => setPropByPath(path, val)} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default TypographyInput;
