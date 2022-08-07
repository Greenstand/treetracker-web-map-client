import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  List,
  ListItem,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import TypographyInput from './TypographyInput';
import TypographyThumbnail from './TypographyThumbnail';

function SelectTypographyProp(props) {
  const { prop, path } = props;
  const { propName, options } = prop;

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
          aria-controls={`select-typography-${propName}-content`}
          id={`select-typography-${propName}-header`}
          sx={{
            background: '#eee',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              width: 1,
            }}
          >
            <Typography>{propName}</Typography>
            <TypographyThumbnail
              key={`typography-thumbnail-${propName}`}
              text={`style for ${propName}`}
              path={path}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {options.map((option) =>
              option === 'fontWeight' ? null : (
                <ListItem
                  key={`typography-input-${option}`}
                  sx={{
                    px: 0,
                  }}
                >
                  <TypographyInput path={`${path}.${option}`} label={option} />
                </ListItem>
              ),
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default SelectTypographyProp;
