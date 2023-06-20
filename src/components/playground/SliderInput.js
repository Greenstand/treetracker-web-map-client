import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { usePlaygroundUtils } from 'hooks/contextHooks';

export default function SliderInput({ prop, pathToProp, propName }) {
  // const { getPropByPath } = usePlaygroundTheme();
  const { setPropByPath } = usePlaygroundUtils();
  const [error, setError] = useState('');
  const [value, setValue] = useState(4);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPropByPath(`${pathToProp}.${propName}`, newValue);
  };

  return (
    <FormControl error={error.length > 0} sx={{ width: 1 }} variant="standard">
      <Typography
        id="slider-input"
        variant="caption"
        style={{ color: 'rgba(0,0,0,0.6)' }}
      >
        {prop.displayText}
      </Typography>
      <Slider
        value={value}
        aria-labelledby="slider-input"
        valueLabelDisplay="auto"
        onChange={handleChange}
        {...prop?.configs}
      />
      <Input value={value} size="small" />
    </FormControl>
  );
}
