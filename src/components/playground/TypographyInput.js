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
import { useState, useEffect, useCallback, memo } from 'react';
import {
  usePlaygroundUtils,
  usePlaygroundFonts,
  usePlaygroundTheme,
} from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';
import {
  predefinedFonts as defaultFonts,
  propRules,
  fontWeightNameToValue,
} from 'models/themePlaygroundOptions';
import { loadFonts } from 'models/utils';

function FontFamilyWeightElm({ label, path, fontValue }) {
  const { getPropByPath } = usePlaygroundTheme();
  const { setPropByPath } = usePlaygroundUtils();
  const [fonts, setFonts] = usePlaygroundFonts();
  const [value, setValue] = useState(() => getPropByPath(path));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const defaultValue = useDefaultValue(value);

  useEffect(() => {
    setValue(defaultValue.current.toString());
    setError('');
  }, [fontValue, defaultValue]);

  const loadWeight = useCallback(
    (userInput) => {
      if (!(fontValue in fonts)) return false;
      if (fontValue === '') {
        return setError('Please add a font first');
      }

      // handle case of not a convertable string weight
      // 'bolder', 'lighter', 'inherit' ....
      if (!(userInput in fontWeightNameToValue)) {
        setPropByPath(path, userInput);
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
      loadFonts([`${fontValue}:${weightToLoad}`]).then((fontLoaded) => {
        setLoading(false);
        if (!fontLoaded) {
          return setError('Something went wrong. Please try again');
        }
        setFonts((prevFonts) => ({
          ...prevFonts,
          [fontValue]: [...prevFonts[fontValue], weightToLoad],
        }));
        setPropByPath(path, userInput);
        return true;
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
  const { getPropByPath } = usePlaygroundTheme();
  const { setPropByPath } = usePlaygroundUtils();
  const [value, setValue] = useState(() => getPropByPath(path));
  const [fonts] = usePlaygroundFonts();
  const [error, setError] = useState('');
  const defaultValue = useDefaultValue(value);

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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}
              >
                <span>{font}</span>
                {!(font in defaultFonts) && <FontDownloadIcon />}
              </Box>
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

function TypographyInput({ path, label, typographyValue }) {
  const { setPropByPath } = usePlaygroundUtils();
  const [value, setValue] = useState(typographyValue);
  const [isValid, setValid] = useState(true);
  const defaultValue = useDefaultValue(value);

  useEffect(() => {
    setValue(typographyValue);
  }, [typographyValue]);

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

export default memo(TypographyInput);
