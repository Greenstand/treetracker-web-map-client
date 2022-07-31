import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ListItem,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { usePlaygroundFonts } from '../../context/playgroundContext';
import { loadFonts } from '../../models/utils';

function FontsList(props) {
  const { title, list, canAddItems } = props;
  const [fonts, setFonts] = usePlaygroundFonts();
  const [loading, setLoading] = useState(false);

  const handleClick = async (font) => {
    // if (fonts.indexOf(font) > -1) return false;
    if (fonts.some((fontObj) => fontObj.name === font)) return false;

    const formattedName = font.charAt(0).toUpperCase() + font.slice(1);

    setLoading(true);
    await loadFonts([formattedName]).then((hasFont) => {
      setLoading(false);
      if (!hasFont) return false;

      setFonts((prevFonts) => [
        ...prevFonts,
        { name: formattedName, weights: [] },
      ]);
      return true;
    });
    return true;
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
        defaultExpanded
        elevation={0}
        sx={{
          width: 1,
          borderBottom: '1px solid #ddd',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`select-fonts-available-content-${title}`}
          id={`select-fonts-available-header-${title}`}
          sx={{
            background: '#eee',
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Typography>{title}</Typography>
            {loading && <CircularProgress />}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1}>
            {list.map((font) => (
              <Grid
                item
                key={`fonts-customization-${font.name}${
                  canAddItems && '-addable'
                }`}
              >
                {canAddItems ? (
                  <Chip
                    label={font.name}
                    icon={<AddIcon />}
                    onClick={() => handleClick(font.name)}
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  />
                ) : (
                  <Chip
                    label={font.name}
                    sx={{
                      textTransform: 'capitalize',
                      fontFamily: font.name,
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default FontsList;
