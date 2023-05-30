import { ListItem } from '@mui/material';
import { CONFIG_INPUT_TYPES } from 'models/themePlaygroundOptions';
import ColorInput from './ColorInput';
import FontFamilyInput from './FontFamilyInput';
import FontWeightInput from './FontWeightInput';
import TextInput from './TextInput';

export default function PropInput({ prop, path, propName }) {
  let input = null;

  switch (prop.inputType) {
    case CONFIG_INPUT_TYPES.COLOR:
      input = <ColorInput prop={prop} pathToProp={path} propName={propName} />;
      break;
    case CONFIG_INPUT_TYPES.FONT_FAMILY:
      input = (
        <FontFamilyInput prop={prop} pathToProp={path} propName={propName} />
      );
      break;
    case CONFIG_INPUT_TYPES.FONT_WEIGHT:
      input = (
        <FontWeightInput prop={prop} pathToProp={path} propName={propName} />
      );
      break;
    default:
      input = <TextInput prop={prop} pathToProp={path} propName={propName} />;
      break;
  }

  return (
    <ListItem
      sx={{
        p: 0,
      }}
    >
      {input}
    </ListItem>
  );
}
