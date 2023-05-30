import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  List,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import PropInput from './PropInput';
import TypographyThumbnail from './TypographyThumbnail';

export default function TypographySection({ prop, path, propName }) {
  return (
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
            path={`${path}.${propName}`}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {Object.entries(prop.props).map(([childPropName, childProp]) => (
            <PropInput
              key={`${path}-${propName}-${childPropName}`}
              path={`${path}.${propName}`}
              prop={childProp}
              propName={childPropName}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
