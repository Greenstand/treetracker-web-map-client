import { Box, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

function TypographyInput(props) {
  const { label, initial, onChange } = props;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);

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

export default TypographyInput;
