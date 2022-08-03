import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { usePlaygroundFonts } from '../../context/playgroundContext';
import { loadFonts } from '../../models/utils';

// eslint-disable-next-line prefer-regex-literals
const numberValidator = new RegExp('^[0-9]*$');

function compareArrays(arr1, arr2) {
  const distinctArr = arr1.filter((a) => !arr2.includes(a));
  return distinctArr;
}

function FontAddInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [fontWeightValues, setFontWeightValues] = useState('');
  const [fontWeightError, setFontWeightError] = useState('');
  const [fonts, setFonts] = usePlaygroundFonts();

  const submitDisabled = error.length > 0 || fontWeightError.length > 0;

  const [loading, setLoading] = useState({
    fontValue: false,
    fontWeights: false,
  });

  const handleSubmit = useCallback(
    async (e) => {
      const fontWeightArr =
        fontWeightValues.trim().length > 0
          ? fontWeightValues.split(',').map((w) => parseInt(w.trim(), 10))
          : [];

      e.preventDefault();
      e.persist();
      if (fontWeightError) return false;

      const formattedName = value.charAt(0).toUpperCase() + value.slice(1);
      let fontNameWithWeights = '';
      let distinctWeights = [...fontWeightArr];
      let fontPresentInTheme = false;
      let prevWeights = [];

      for (let i = 0; i < fonts.length; i += 1) {
        if (fonts[i].name === formattedName) {
          distinctWeights = compareArrays(fontWeightArr, fonts[i].weights);
          prevWeights = fonts[i].weights;
          fontPresentInTheme = true;
          break;
        }
      }

      const shouldLoadFonts =
        !fontPresentInTheme ||
        (fontPresentInTheme && distinctWeights.length > 0);
      if (!shouldLoadFonts) return setError('Font Already Loaded');

      fontNameWithWeights =
        distinctWeights.length > 0
          ? `${formattedName}:${distinctWeights.join()}`
          : formattedName;
      setLoading({
        fontValue: !fontPresentInTheme,
        fontWeights: distinctWeights.length > 0,
      });
      await loadFonts([fontNameWithWeights]).then((hasFont) => {
        setLoading({
          fontValue: false,
          fontWeights: false,
        });
        if (!hasFont) return setError('Font could not be loaded');
        const updatedFont = {
          name: formattedName,
          weights: [...prevWeights, ...distinctWeights],
        };
        if (fontPresentInTheme)
          setFonts((prevFonts) =>
            prevFonts.map((prevFont) =>
              prevFont.name === formattedName ? updatedFont : prevFont,
            ),
          );
        else setFonts((prevFonts) => [...prevFonts, { ...updatedFont }]);
        setValue('');
        setFontWeightValues('');
        return true;
      });
      return true;
    },
    [fontWeightError, fontWeightValues, fonts, setFonts, value],
  );

  const handleChange = (e, type) => {
    if (type === 'font') {
      const userInput = e.target.value;
      setValue(userInput);
      if (error) setError('');
    }
    if (type === 'weight') {
      setFontWeightValues(e.target.value);
      const weights = e.target.value;
      const splittedWeights = weights.split(',');
      for (let i = 0; i < splittedWeights.length; i += 1) {
        if (!numberValidator.test(splittedWeights[i].trim())) {
          setFontWeightError('font Weights must be formatted properly');
          return;
        }
      }
      setFontWeightError('');
      setError('');
    }
  };

  return (
    <ListItem
      sx={{
        p: 0,
      }}
    >
      <Accordion
        square
        disableGutters
        elevation={0}
        sx={{
          width: 1,
          borderBottom: '1px solid #ddd',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="select-fonts-add-content"
          id="select-fonts-add-header"
          sx={{
            background: '#eee',
          }}
        >
          <Typography>Add New Font</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form>
            <TextField
              variant="standard"
              error={error.length > 0}
              label="Font Name"
              value={value}
              onChange={(e) => handleChange(e, 'font')}
              sx={{
                width: 1,
              }}
              helperText={error || 'Add font from Google Fonts'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading.fontValue ? (
                      <CircularProgress size="1.5rem" />
                    ) : (
                      <AddIcon />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="standard"
              error={fontWeightError.length > 0}
              label="Font weights"
              value={fontWeightValues}
              onChange={(e) => handleChange(e, 'weight')}
              sx={{
                width: 1,
              }}
              helperText={
                fontWeightError || 'Add font weights e.g(500 or 500,700)'
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading.fontWeights ? (
                      <CircularProgress size="1.5rem" />
                    ) : (
                      <AddIcon />
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitDisabled}
            >
              submit
            </button>
          </form>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default FontAddInput;
