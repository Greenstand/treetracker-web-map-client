import { RestartAlt } from '@mui/icons-material';
import {
  Box,
  InputAdornment,
  CircularProgress,
  InputLabel,
  Tooltip,
  FormControl,
  Input,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect, useCallback, memo } from 'react';
import { usePlaygroundUtils, usePlaygroundFonts, usePlaygroundTheme } from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';
import { propRules, fontWeightNameToValue } from 'models/themePlaygroundOptions';
import { loadFonts } from 'models/utils';

function FontWeightInput({ prop, pathToProp, propName }) {
  const { getPropByPath } = usePlaygroundTheme();
  const { setPropByPath } = usePlaygroundUtils();
  const [fonts, setFonts] = usePlaygroundFonts();
  const fontFamily = getPropByPath(`${pathToProp}.fontFamily`);
  const [value, setValue] = useState(() =>
    getPropByPath(`${pathToProp}.${propName}`),
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const defaultValue = useDefaultValue(value);

  useEffect(() => {
    setValue(defaultValue || '');
    setError('');
  }, [fontFamily, defaultValue]);

  const loadWeight = useCallback(
    (userInput) => {
      if (!(fontFamily in fonts)) return false;
      if (fontFamily === '') {
        return setError('Please add a font first');
      }

      // handle case of not a convertable string weight
      // 'bolder', 'lighter', 'inherit' ....
      if (!(userInput in fontWeightNameToValue)) {
        setPropByPath(`${pathToProp}.${propName}`, userInput);
        return true;
      }

      const isWeightValueNumber = Number.isNaN(Number(userInput)) === false;

      // convert the string weight to an number
      // 'bold' & 'normal'
      let weightToLoad = userInput;
      if (isWeightValueNumber === false) {
        weightToLoad = fontWeightNameToValue[userInput];
      }

      setLoading(true);
      loadFonts([`${fontFamily}:${weightToLoad}`]).then((fontLoaded) => {
        setLoading(false);
        if (!fontLoaded) {
          return setError('Something went wrong. Please try again');
        }
        setFonts((prevFonts) => ({
          ...prevFonts,
          [fontFamily]: [...prevFonts[fontFamily], weightToLoad],
        }));
        setPropByPath(`${pathToProp}.${propName}`, userInput);
        return true;
      });

      return true;
    },
    [fontFamily, fonts, propName, pathToProp, setFonts, setPropByPath],
  );

  const resetTypography = () => {
    setValue(defaultValue);
    setPropByPath(`${pathToProp}.${propName}`, defaultValue);
  };

  const handleChange = (e) => {
    const userInput = e.target.value;
    setValue(userInput);
    if (!propRules[propName].test(userInput)) {
      setError(`Invalid ${prop.displayText}`);
      return;
    }

    e.target.blur();
    loadWeight(userInput);
    setError('');
  };

  return (
    <FormControl error={error.length > 0} sx={{ width: 1 }} variant="standard">
      <InputLabel sx={{ width: '133%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{prop.displayText}</span>
          <Tooltip sx={{ cursor: 'pointer' }} title="Reset to Default">
            <RestartAlt onClick={resetTypography} color="error" />
          </Tooltip>
        </Box>
      </InputLabel>
      <Input
        value={value}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            {loading ? <CircularProgress size="1.5rem" /> : null}
          </InputAdornment>
        }
      />
      <FormHelperText>{error || `Load ${prop.displayText}.`}</FormHelperText>
    </FormControl>
  );
}

export default memo(FontWeightInput);
