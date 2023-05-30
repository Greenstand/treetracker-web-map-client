import { ListItem } from '@mui/material';
import log from 'loglevel';
import { CONFIG_SECTION_TYPES } from 'models/themePlaygroundOptions';
import ColorSection from './ColorSection';
import TypographySection from './TypographySection';

export default function PropSection({ section, path, sectionName }) {
  let sectionElement = null;

  switch (section.sectionType) {
    case CONFIG_SECTION_TYPES.COLOR:
      sectionElement = (
        <ColorSection prop={section} path={path} propName={sectionName} />
      );
      break;
    case CONFIG_SECTION_TYPES.TYPOGRAPHY:
      sectionElement = (
        <TypographySection prop={section} path={path} propName={sectionName} />
      );
      break;
    default:
      log.error(
        `No Component found for '${section.sectionType}', nothing will be rendered.`,
      );
      break;
  }

  return (
    <ListItem
      sx={{
        p: 0,
      }}
    >
      {sectionElement}
    </ListItem>
  );
}
