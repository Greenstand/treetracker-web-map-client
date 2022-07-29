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
import { useState } from 'react';
import { usePlaygroundFonts } from '../../context/playgroundContext';
import { loadFonts } from '../../models/utils';

function FontAddInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [fonts, setFonts] = usePlaygroundFonts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.persist();

    const formattedName = value.charAt(0).toUpperCase() + value.slice(1);
    if (fonts.indexOf(formattedName) > -1)
      return setError('Font already loaded');

    setLoading(true);
    await loadFonts([formattedName]).then((hasFont) => {
      setLoading(false);
      if (!hasFont) return setError('Font could not be loaded');

      setFonts((prevFonts) => [...prevFonts, formattedName]);
      setValue('');
      return true;
    });
    return true;
  };

  const handleChange = (e) => {
    const userInput = e.target.value;
    setValue(userInput);
    if (error) setError('');
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
          <form onSubmit={handleSubmit}>
            <TextField
              variant="standard"
              error={error.length > 0}
              label="Font Name"
              value={value}
              onChange={handleChange}
              sx={{
                width: 1,
              }}
              helperText={error || 'Add font from Google Fonts'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? <CircularProgress size="1.5rem" /> : <AddIcon />}
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default FontAddInput;
