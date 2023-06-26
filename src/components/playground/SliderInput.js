import { RestartAlt } from '@mui/icons-material';
import { Box, FormControl, Tooltip, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useMemo } from 'react';
import { usePlaygroundTheme, usePlaygroundUtils } from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';

export default function SliderInput({ prop, pathToProp, propName }) {
  const { min, max, step, unit } = prop?.inputProps ?? {};

  const { setPropByPath } = usePlaygroundUtils();
  const { getPropByPath } = usePlaygroundTheme();
  const value = getPropByPath(`${pathToProp}.${propName}`);
  const defaultValue = useDefaultValue(value);

  const resetSlider = () => {
    setPropByPath(`${pathToProp}.${propName}`, defaultValue);
  };

  const handleChange = (_, newValue) => {
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          id="slider-input"
          variant="caption"
          style={{ color: 'rgba(0,0,0,0.6)' }}
        >
          {prop.displayText}
        </Typography>
        <Tooltip sx={{ cursor: 'pointer' }} title="Reset to Default">
          <RestartAlt
            onClick={resetSlider}
            color="error"
            sx={{ fontSize: '18px' }}
          />
        </Tooltip>
      </Box>

      <Slider
        style={{ width: '90%', margin: '0 0 30px 20px' }}
        value={parseInt(value, 10)}
        aria-labelledby="slider-input"
        valueLabelDisplay="auto"
        onChange={handleChange}
        marks={marks}
        sx={{
          '& .MuiSlider-markLabel': {
            fontSize: '12px',
          },
        }}
        {...prop?.inputProps}
      />
    </FormControl>
  );
}
