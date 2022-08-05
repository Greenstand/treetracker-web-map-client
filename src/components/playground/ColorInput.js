import ColorizeIcon from '@mui/icons-material/Colorize';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Popover,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
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
  let timer = null;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!isGradient) if (!propRules.color.test(userValue)) return;
    setValid(true);
    setPropByPath(path, userValue);
  };

  const handleColorChange = (color) => {
    if (timer) clearTimeout(timer);
    // if the user drags too fast the state can't keep up
    timer = setTimeout(() => {
      setPropByPath(path, color);
    }, 300);
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
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <HexColorPicker color={value} onChange={handleColorChange} />
      </Popover>
    </Box>
  );
}

export default ColorInput;
