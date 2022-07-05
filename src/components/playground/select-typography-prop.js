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
import log from 'loglevel';
import TypographyInput from './typography-input';
import TypogarphyThumbnail from './typography-thumbnail';
import { usePropUtils } from '../../context/playgroundContext';

function SelectColorProp(props) {
  const { prop, path } = props;
  const { getPropByPath, setPropByPath } = usePropUtils();

  const childProps = getPropByPath(path);

  const handleChange = ({ propName, newValue }) => {
    log.warn('prop changed', `${path}.${propName} with ${newValue}`);
    setPropByPath(`${path}.${propName}`, newValue);
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
          aria-controls={`select-typography-${prop}-content`}
          id={`select-typography-${prop}-header`}
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
            <Typography>{prop}</Typography>
            <TypogarphyThumbnail
              key={`typography-thumbnail-${prop}`}
              text={`style for ${prop}`}
              previewStyle={childProps}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {Object.entries(childProps).map(
              ([name, value]) =>
                typeof value === 'string' && (
                  <ListItem
                    key={`typography-input-${name}`}
                    sx={{
                      px: 0,
                    }}
                  >
                    <TypographyInput
                      label={name}
                      initial={value}
                      onChange={handleChange}
                    />
                  </ListItem>
                ),
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default SelectColorProp;
