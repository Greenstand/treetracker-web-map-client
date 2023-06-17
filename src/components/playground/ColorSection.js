import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Stack,
  Typography,
} from '@mui/material';
import { usePlaygroundTheme, usePlaygroundThemeType } from 'hooks/contextHooks';
import ColorThumbnail from './ColorThumbnail';
import PropInput from './PropInput';

export default function ColorSection({ prop, path, propName }) {
  const [themeType] = usePlaygroundThemeType();
  const { getPropByPath } = usePlaygroundTheme();

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
            {Object.keys(prop.props).map((option) => {
              const color = getPropByPath(
                `${path}.${themeType}.${propName}.${option}`,
              );
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
          {Object.entries(prop.props).map(([childPropName, childProp]) => (
            <PropInput
              key={`${path}-${themeType}-${propName}-${childPropName}`}
              path={`${path}.${themeType}.${propName}`}
              prop={childProp}
              propName={childPropName}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
