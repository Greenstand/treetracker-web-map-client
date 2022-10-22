import ColorizeIcon from '@mui/icons-material/Colorize';
import RestartAlt from '@mui/icons-material/RestartAlt';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Popover,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';
import SquareIconButton from './SquareIconButton';
import { usePlaygroundUtils } from '../../hooks/contextHooks';
import useDisclosure from '../../hooks/useDisclosure';
import { propRules } from '../../models/themePlaygroundOptions';

function ColorInput(props) {
  const { path, label } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [isValid, setValid] = useState(true);
  const isGradient = /gradient/i.test(label);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pickerRef = useRef(null);
  const timer = useRef(null);
  const [defaultColor, setDefaultColor] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // change single colors back to default
  const handleReset = () => {
    setValue(defaultColor);
    setPropByPath(path, defaultColor);
  };

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!isGradient) if (!propRules.color.test(userValue)) return;
    setValid(true);
    setPropByPath(path, userValue);
  };

  const handleColorChange = (color) => {
    setValue(color);
    // if the user drags too fast the (global) state can't keep up
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPropByPath(path, color);
    }, 200);
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onOpen} ref={pickerRef}>
                <ColorizeIcon />
              </IconButton>
              <SquareIconButton
                icon={<RestartAlt />}
                color="error"
                tooltip="Reset to default"
                onClick={handleReset}
              />
            </InputAdornment>
          ),
        }}
      />
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

export default ColorInput;
