import { FormControl, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { withStyles } from '@mui/styles';
import { useMemo, useState } from 'react';
import { usePlaygroundUtils } from 'hooks/contextHooks';

const styles = {
  markLabel: {
    fontSize: '12px',
  },
};

const CustomSlider = withStyles(styles)((props) => (
  <Slider classes={{ markLabel: props.classes.markLabel }} {...props} />
));

export default function SliderInput({ prop, pathToProp, propName }) {
  const { setPropByPath } = usePlaygroundUtils();

  const { min, max, step, unit } = prop?.inputProps ?? {};

  const [value, setValue] = useState(min);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPropByPath(`${pathToProp}.${propName}`, newValue);
  };

  const marks = useMemo(() => {
    const marksArr = [];
    for (let i = min; i <= max; i += step) {
      marksArr.push({
        value: i,
        label: `${i}${unit}`,
      });
    }

    return marksArr;
  }, [min, max, step, unit]);

  return (
    <FormControl sx={{ width: 1 }} variant="standard">
      <Typography
        id="slider-input"
        variant="caption"
        style={{ color: 'rgba(0,0,0,0.6)' }}
      >
        {prop.displayText}
      </Typography>
      <CustomSlider
        style={{ width: '90%', margin: '0 0 30px 20px' }}
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
