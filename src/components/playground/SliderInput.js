import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import { useMemo, useState } from 'react';
import { usePlaygroundUtils } from 'hooks/contextHooks';

export default function SliderInput({ prop, pathToProp, propName }) {
 
  const { setPropByPath } = usePlaygroundUtils();
  
  const [value, setValue] = useState(4);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPropByPath(`${pathToProp}.${propName}`, newValue);
  };

  const {min,max,step,unit} = prop?.inputProps ?? {}

  
  const marks = useMemo(() => {

    const marksArr = [];
    for(let i=min;i<=max;i +=step){
      marksArr.push({
            value:i,
            label: `${i}${unit}`
          })
    }

    return marksArr;

  },[min,max,step,unit])


  return (
    <FormControl sx={{ width: 1 }} variant="standard">
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
        marks={marks}
        {...prop?.inputProps}
        
      />
    
    </FormControl>
  );
}
