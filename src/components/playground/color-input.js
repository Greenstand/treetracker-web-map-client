import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

function ColorInput(props) {
  const { label, initial, onChange } = props;
  const [value, setValue] = useState(initial);

  /**
   * valid: hex, rgb, rgba
   */
  const validColor =
    /^#([a-f0-9]{6}|[a-f0-9]{3})$|^rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)$/gi;

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);

    if (!validColor.test(userValue)) return;
    onChange({ propName: label, newValue: userValue });
  };

  return (
    <Box
      component="form"
      sx={{
        flex: '1',
      }}
    >
      <TextField
        variant="standard"
        label={label}
        value={value}
        onChange={handleChange}
        sx={{
          textTransform: 'capitalize',
          width: 1,
        }}
      />
    </Box>
  );
}

export default ColorInput;
