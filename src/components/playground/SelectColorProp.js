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
import { usePlaygroundTheme } from 'hooks/contextHooks';
import ColorInput from './ColorInput';
import ColorThumbnail from './ColorThumbnail';

function SelectColorProp(props) {
  const { prop, path } = props;
  const { propName, options } = prop;
  const { getPropByPath } = usePlaygroundTheme();

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
          aria-controls={`select-color-${propName}-content`}
          id={`select-color-${propName}-header`}
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
              {propName}
            </Typography>
            <Stack direction="row">
              {options.map((option) => {
                const color = getPropByPath(`${path}.${option}`);
                return (
                  <ColorThumbnail
                    key={`color-thumbnail-${propName}-${option}`}
                    color={color}
                  />
                );
              })}
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {options.map((option) => {
              const color = getPropByPath(`${path}.${option}`);
              return (
                <ListItem
                  key={`color-input-${path}-${option}`}
                  sx={{
                    px: 0,
                  }}
                >
                  <ColorInput
                    path={`${path}.${option}`}
                    color={color}
                    label={option}
                  />
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default SelectColorProp;
