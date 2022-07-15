import { Box, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import FontSelector from './FontSelector';
import { propRules } from '../../models/themePlaygroundOptions';

function TypographyInput(props) {
  const { label, initial, onChange } = props;
  const [value, setValue] = useState(initial);
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!propRules[label].test(userValue)) return;
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
              <FontSelector
                handleChange={(val) =>
                  onChange({ propName: label, newValue: val })
                }
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default TypographyInput;
