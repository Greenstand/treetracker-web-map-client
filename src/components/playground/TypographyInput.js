import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { loadFonts } from 'models/utils';
import FontSelector from './FontSelector';
import {
  usePlaygroundUtils,
  usePlaygroundFonts,
} from '../../context/playgroundContext';
import { propRules } from '../../models/themePlaygroundOptions';

const allowedFontWeights = new Set([
  'normal',
  'bold',
  'BloodtypeOutlined',
  'lighter',
  'bolder',
  'inherit',
  'initial',
  'revert',
  'revert-layer',
  'unset',
]);

function FontFamilyWeightElm(props) {
  const { label, path, fontValue } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const [fonts, setFonts] = usePlaygroundFonts();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue.toString());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fonts[fontValue]) {
      setValue(initialValue.toString());
    }
  }, [fontValue, fonts, initialValue]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (error) return false;
      if (!fonts[fontValue]) return false;
      if (value.trim() === '') return false;
      if (fontValue === '')
        return setError('please add aleast one font family.');

      if (allowedFontWeights.has(value)) {
        setPropByPath(path, value);
        return true;
      }

      const userInput = parseInt(value.trim(), 10);
      const fontFamilytoLoad = [];

      if (fonts[fontValue]) {
        if (fonts[fontValue].includes(userInput)) {
          setPropByPath(path, userInput);
          return true;
        }

        fontFamilytoLoad.push(`${fontValue}:${userInput}`);
      }

      setLoading(true);
      loadFonts(fontFamilytoLoad).then((fontLoaded) => {
        setLoading(false);
        if (!fontLoaded)
          return setError('Something went wrong. please try again');
        setFonts((prevFonts) => ({
          ...prevFonts,
          ...{ [fontValue]: [...fonts[fontValue], userInput] },
        }));
        return setPropByPath(path, userInput);
      });

      return true;
    },
    [error, fontValue, fonts, path, setFonts, setPropByPath, value],
  );

  const handleChange = (e) => {
    const userInput = e.target.value;
    setValue(userInput);
    if (!propRules[label].test(userInput)) {
      setError('Invalid fontWeight');
      return;
    }
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        variant="standard"
        error={error.length > 0}
        label="Font Weight"
        value={value}
        onChange={handleChange}
        sx={{
          width: 1,
        }}
        helperText={error || 'press enter to load the weight.'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? <CircularProgress size="1.5rem" /> : null}
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}

function FontFamily(props) {
  const { label, path } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [fonts] = usePlaygroundFonts();
  const [error, setError] = useState('');
  const fontWeightPath = `${path
    .split('.')
    .splice(0, path.split('.').length - 1)
    .join('.')}.fontWeight`;

  const handleChange = (e) => {
    const userInput =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

    setValue(userInput);
    // setValid(false);

    // if (!propRules[label].test(userValue)) return;
    if (!fonts[userInput]) {
      setError('Font family not loaded.');
      return;
    }
    setError('');
    setPropByPath(path, userInput);
  };

  return (
    <>
      <TextField
        variant="standard"
        label={label}
        value={value}
        error={error.length > 0}
        onChange={handleChange}
        helperText={error || 'Add Fontfamily from loaded families.'}
        sx={{
          textTransform: 'capitalize',
          width: 1,
          marginBottom: '5px',
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FontSelector
                handleChange={(val) => {
                  setValue(val);
                  setPropByPath(path, val);
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <FontFamilyWeightElm
        label="fontWeight"
        path={fontWeightPath}
        fontValue={value}
      />
    </>
  );
}

function TypographyInput(props) {
  const { path, label } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const userValue = e.target.value;
    setValue(userValue);
    setValid(false);

    if (!propRules[label].test(userValue)) return;
    setValid(true);
    setPropByPath(path, userValue);
  };

  return (
    <Box
      sx={{
        flex: '1',
      }}
    >
      {label === 'fontFamily' ? (
        <FontFamily label={label} path={path} />
      ) : (
        <TextField
          variant="standard"
          error={!isValid}
          label={label}
          value={value}
          onChange={handleChange}
          sx={{
            textTransform: 'capitalize',
            width: 1,
          }}
          helperText={!isValid && 'Invalid syntax'}
        />
      )}
    </Box>
  );
}

export default TypographyInput;
