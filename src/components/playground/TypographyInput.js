import { RestartAlt } from '@mui/icons-material';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import {
  Box,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  FormControl,
  Input,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { loadFonts } from 'models/utils';
import FontSelector from './FontSelector';
import {
  usePlaygroundUtils,
  usePlaygroundFonts,
} from '../../hooks/contextHooks';
import {
  predefinedFonts as defaultFonts,
  propRules,
} from '../../models/themePlaygroundOptions';

const allowedFontWeights = new Set([
  'normal',
  'bold',
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
  const [value, setValue] = useState('');
  const [defaultValue, setDefaultValue] = useState(initialValue.toString());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue.toString());
    setError('');
  }, [fontValue, initialValue]);

  const loadWeight = useCallback(
    (weightValue) => {
      if (!fonts[fontValue]) return false;
      if (weightValue.trim() === '') return false;
      if (fontValue === '')
        return setError('please add aleast one font family.');

      if (allowedFontWeights.has(weightValue)) {
        setPropByPath(path, weightValue);
        return true;
      }

      const userInput = parseInt(weightValue.trim(), 10);
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
    [fontValue, fonts, path, setFonts, setPropByPath],
  );

  const resetTypography = () => {
    setValue(defaultValue);
    setPropByPath(path, defaultValue);
  };

  const handleChange = (e) => {
    const userInput = e.target.value;
    setValue(userInput);
    if (!propRules[label].test(userInput)) {
      setError('Invalid fontWeight');
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
          <span>Font Weight</span>
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
      <FormHelperText>{error || 'Load Font weight.'}</FormHelperText>
    </FormControl>
  );
}

function FontFamily(props) {
  const { label, path } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();
  const initialValue = getPropByPath(path);
  const [value, setValue] = useState(initialValue);
  const [defaultValue, setDefaultValue] = useState(initialValue);
  const [fonts] = usePlaygroundFonts();
  const [error, setError] = useState('');
  const fontWeightPath = `${path
    .split('.')
    .splice(0, path.split('.').length - 1)
    .join('.')}.fontWeight`;

  const resetTypography = () => {
    setValue(defaultValue);
    setPropByPath(path, defaultValue);
  };

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
      <FormControl
        id="font-family"
        error={error.length > 0}
        sx={{
          textTransform: 'capitalize',
          width: 1,
          marginBottom: '5px',
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
            {label}
            <Tooltip sx={{ cursor: 'pointer' }} title="Reset to Default">
              <RestartAlt onClick={resetTypography} color="error" />
            </Tooltip>
          </Box>
        </InputLabel>
        <Select value={value} onChange={handleChange}>
          {Object.keys(fonts).map((font) => (
            <MenuItem value={font} key={`font-selector-menuitem-${font}`}>
              {font}{' '}
              <span style={{ marginLeft: 'auto' }}>
                {!(font in defaultFonts) && <FontDownloadIcon />}
              </span>
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {error || 'Add Fontfamily from loaded families.'}
        </FormHelperText>
      </FormControl>

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
  const [defaultValue, setDefaultValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const resetTypography = () => {
    setPropByPath(path, defaultValue);
    setValue(defaultValue);
    setValid(true);
  };

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
              {label}
              <Tooltip sx={{ cursor: 'pointer' }} title="Reset to Default">
                <RestartAlt onClick={resetTypography} color="error" />
              </Tooltip>
            </Box>
          </InputLabel>
          <Input value={value} onChange={handleChange} />
          <FormHelperText>{!isValid && 'Invalid syntax'}</FormHelperText>
        </FormControl>
      )}
    </Box>
  );
}

export default TypographyInput;
