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
import ColorInput from './ColorInput';
import ColorThumbnail from './ColorThumbnail';
import { usePlaygroundUtils } from '../../context/playgroundContext';

function SelectColorProp(props) {
  const { prop, path } = props;
  const { getPropByPath, setPropByPath } = usePlaygroundUtils();

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
          aria-controls={`select-color-${prop}-content`}
          id={`select-color-${prop}-header`}
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
            <Typography
              sx={{
                textTransform: 'capitalize',
              }}
            >
              {prop}
            </Typography>
            <Stack direction="row">
              {Object.values(childProps).map((color, idx) => (
                <ColorThumbnail
                  /* eslint-disable-next-line */
                  key={`color-thumbnail-${color}-${idx}`}
                  color={color}
                />
              ))}
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {Object.entries(childProps).map(([name, value]) => (
              <ListItem
                key={`color-input-${name}`}
                sx={{
                  px: 0,
                }}
              >
                <ColorInput
                  label={name}
                  initial={value}
                  onChange={handleChange}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default SelectColorProp;
