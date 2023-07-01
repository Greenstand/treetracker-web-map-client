import { RestartAlt } from '@mui/icons-material';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useState } from 'react';
import {
  usePlaygroundUtils,
  usePlaygroundFonts,
  usePlaygroundTheme,
} from 'hooks/contextHooks';
import { useDefaultValue } from 'hooks/cwmHooks';
import { predefinedFonts as defaultFonts } from 'models/themePlaygroundOptions';

export default function FontFamilyInput({ prop, pathToProp, propName }) {
  const { getPropByPath } = usePlaygroundTheme();
  const { setPropByPath } = usePlaygroundUtils();
  const value = getPropByPath(`${pathToProp}.${propName}`);
  const [fonts] = usePlaygroundFonts();
  const [error, setError] = useState('');
  const defaultValue = useDefaultValue(value);

  const resetTypography = () => {
    setPropByPath(`${pathToProp}.${propName}`, defaultValue);
  };

  const handleChange = (e) => {
    const userInput = e.target.value;

    if (!(userInput in fonts)) {
      setError('Font family not loaded.');
      return;
    }

    setError('');
    setPropByPath(`${pathToProp}.${propName}`, userInput);
  };

  return (
    <FormControl
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
          {prop.displayText}
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
  );
}
