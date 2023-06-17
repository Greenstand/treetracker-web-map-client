import RestartAlt from '@mui/icons-material/RestartAlt';
import {
  Box,
  FormControl,
  InputLabel,
  Tooltip,
  Input,
  FormHelperText,
} from '@mui/material';
import { useState, memo } from 'react';
import { usePlaygroundTheme, usePlaygroundUtils } from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';
import { propRules } from 'models/themePlaygroundOptions';

function TextInput({ prop, pathToProp, propName }) {
  const { setPropByPath } = usePlaygroundUtils();
  const { getPropByPath } = usePlaygroundTheme();

  const value = getPropByPath(`${pathToProp}.${propName}`);
  const [isValid, setValid] = useState(true);
  const defaultValue = useDefaultValue(value);

  const resetTypography = () => {
    setPropByPath(`${pathToProp}.${propName}`, defaultValue);
    setValid(true);
  };

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValid(false);

    if (!propRules[propName].test(userValue)) return;
    setValid(true);
    setPropByPath(`${pathToProp}.${propName}`, userValue);
  };

  return (
    <FormControl
      error={!isValid}
      sx={{
        textTransform: 'capitalize',
        width: 1,
        pt: 1,
      }}
      variant="standard"
    >
      <InputLabel sx={{ width: '133%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {prop.displayText}
          <Tooltip sx={{ cursor: 'pointer' }} title="Reset to Default">
            <RestartAlt onClick={resetTypography} color="error" />
          </Tooltip>
        </Box>
      </InputLabel>
      <Input value={value} onChange={handleChange} />
      <FormHelperText>{!isValid && 'Invalid syntax'}</FormHelperText>
    </FormControl>
  );
}

export default memo(TextInput);
