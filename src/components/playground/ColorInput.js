import ColorizeIcon from '@mui/icons-material/Colorize';
import RestartAlt from '@mui/icons-material/RestartAlt';
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  FormControl,
  InputLabel,
  Tooltip,
  Input,
  FormHelperText,
} from '@mui/material';
import { useState, useRef, useEffect, memo } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import { usePlaygroundUtils } from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';
import useDisclosure from 'hooks/useDisclosure';
import { propRules } from 'models/themePlaygroundOptions';

function ColorInput({ path, color, label }) {
  const { setPropByPath } = usePlaygroundUtils();
  const [value, setValue] = useState(color);
  const [isValid, setValid] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pickerRef = useRef(null);
  const timer = useRef(null);
  const isGradient = /gradient/i.test(label);
  const defaultValue = useDefaultValue(value);

  useEffect(() => {
    setValue(color);
  }, [color]);

  // change single colors back to default
  const handleReset = () => {
    setValue(defaultValue);
    setPropByPath(path, defaultValue);
    setValid(true);
  };

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!isGradient && !propRules.color.test(userValue)) return;
    setValid(true);
    setPropByPath(path, userValue);
  };

  const handleColorChange = (newColor) => {
    setValue(newColor);
    // if the user drags too fast the (global) state can't keep up
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPropByPath(path, newColor);
    }, 200);
  };

  return (
    <Box
      sx={{
        flex: '1',
      }}
    >
      <FormControl
        error={!isValid}
        sx={{
          textTransform: 'capitalize',
          width: 1,
        }}
        variant="standard"
      >
        <InputLabel
          sx={{
            width: '130%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{label}</span>
            <Tooltip title="Reset to Default">
              <RestartAlt
                sx={{ cursor: 'pointer' }}
                onClick={handleReset}
                color="error"
              />
            </Tooltip>
          </Box>
        </InputLabel>
        <Input
          multiline={isGradient}
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={onOpen} ref={pickerRef}>
                <ColorizeIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{!isValid && 'Invalid syntax'}</FormHelperText>
      </FormControl>

      <Popover
        open={isOpen}
        onClose={onClose}
        anchorEl={pickerRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            p: 1,
          },
        }}
      >
        <ColorPicker
          value={value}
          onChange={handleColorChange}
          hideControls={!isGradient}
          hidePresets
          hideEyeDrop
          hideColorGuide
          hideAdvancedSliders
          hideInputType
        />
      </Popover>
    </Box>
  );
}

export default memo(ColorInput);
