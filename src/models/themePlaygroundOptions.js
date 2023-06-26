import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';

export const CONFIG_INPUT_TYPES = {
  COLOR: 'COLOR',
  SLIDER: 'SLIDER',
  SELECT: 'SELECT',
  TEXT: 'TEXT',
  FONT_WEIGHT: 'FONT_WEIGHT',
  FONT_FAMILY: 'FONT_FAMILY',
};

export const CONFIG_SECTION_TYPES = {
  COLOR: 'COLOR',
  TYPOGRAPHY: 'TYPOGRAPHY',
};

const defaultFontWeightOptions = [
  {
    label: 'Light',
    value: 300,
  },
  {
    label: 'Normal',
    value: 400,
  },
  {
    label: 'Semi Bold',
    value: 500,
  },
  {
    label: 'Bold',
    value: 600,
  },
  {
    label: 'Bolder',
    value: 700,
  },
  {
    label: 'Super Bold',
    value: 900,
  },
];

export const themeEditorConfig = {
  palette: {
    tab: {
      icon: <PaletteIcon />,
      label: 'Palette',
    },
    background: {
      displayText: 'Background',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        default: {
          displayText: 'Default',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        paper: { displayText: 'Paper', inputType: CONFIG_INPUT_TYPES.COLOR },
        paperDark: {
          displayText: 'Paper Dark',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        greenGradient: {
          displayText: 'Green Gradient',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        OrangeGreenGradient: {
          displayText: 'Orange Green Gradient',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    primary: {
      displayText: 'Primary',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    primaryLight: {
      displayText: 'PrimaryLight',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
      },
    },
    secondary: {
      displayText: 'Secondary',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    secondaryLight: {
      displayText: 'SecondaryLight',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
      },
    },
    notImportant: {
      displayText: 'NotImportant',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
      },
    },
    greyLight: {
      displayText: 'GreyLight',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    darkGrey: {
      displayText: 'DarkGrey',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: {
          displayText: 'Main',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    nearBlack: {
      displayText: 'NearBlack',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: {
          displayText: 'Main',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    text: {
      displayText: 'Text',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        primary: {
          displayText: 'Primary',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        primaryReverse: {
          displayText: 'Primary Reverse',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        disabled: {
          displayText: 'Disabled',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        secondary: {
          displayText: 'Secondary',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
        text1: { displayText: 'Text 1', inputType: CONFIG_INPUT_TYPES.COLOR },
        text2: { displayText: 'Text 2', inputType: CONFIG_INPUT_TYPES.COLOR },
      },
    },
    error: {
      displayText: 'Error',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    warning: {
      displayText: 'Warning',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    info: {
      displayText: 'Info',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
    success: {
      displayText: 'Success',
      sectionType: CONFIG_SECTION_TYPES.COLOR,
      props: {
        main: { displayText: 'Main', inputType: CONFIG_INPUT_TYPES.COLOR },
        light: { displayText: 'Light', inputType: CONFIG_INPUT_TYPES.COLOR },
        dark: { displayText: 'Dark', inputType: CONFIG_INPUT_TYPES.COLOR },
        contrastText: {
          displayText: 'Contrast Text',
          inputType: CONFIG_INPUT_TYPES.COLOR,
        },
      },
    },
  },
  typography: {
    tab: {
      icon: <TextFieldsIcon />,
      label: 'Typography',
    },
    h1: {
      displayText: 'Heading 1',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.SLIDER,
          inputProps: {
            min: 36,
            max: 60,
            step: 4,
            unit: 'px',
          },
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    h2: {
      displayText: 'Heading 2',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.SLIDER,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    h3: {
      displayText: 'Heading 3',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    h4: {
      displayText: 'Heading 4',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    h5: {
      displayText: 'Heading 5',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    h6: {
      displayText: 'Heading 6',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    subtitle1: {
      displayText: 'Subtitle 1',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    subtitle2: {
      displayText: 'Subtitle 2',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    body1: {
      displayText: 'Body 1',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    body2: {
      displayText: 'Body 2',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
    caption: {
      displayText: 'Caption',
      sectionType: CONFIG_SECTION_TYPES.TYPOGRAPHY,
      props: {
        fontFamily: {
          displayText: 'Font Family',
          inputType: CONFIG_INPUT_TYPES.FONT_FAMILY,
        },
        fontWeight: {
          displayText: 'Font Weight',
          inputType: CONFIG_INPUT_TYPES.FONT_WEIGHT,
          options: defaultFontWeightOptions,
        },
        fontSize: {
          displayText: 'Font Size',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        lineHeight: {
          displayText: 'Line Height',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
        letterSpacing: {
          displayText: 'Letter Spacing',
          inputType: CONFIG_INPUT_TYPES.TEXT,
        },
      },
    },
  },
};

export const predefinedFonts = {
  Lato: [],
  Montserrat: [],
  Roboto: [],
  Arial: [],
  Helvetica: [],
  'Times New Roman': [],
  'Sans-Serif': [],
};

// accordiong to MDN font-weight docs
export const fontWeightNameToValue = {
  normal: 400,
  bold: 700,
};

export const propRules = {
  color:
    /^#([a-f0-9]{6}|[a-f0-9]{3})$|^rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)$/i,
  fontFamily:
    // /^((\w+(-\w+)?|inherit|initial|revert|revert-layer|unset)(, )?)+$/i,
    /.*/i,
  fontSize:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)|\d{1,2}%|smaller|larger|medium|(x{1,2}-)?small|(x{1,3}-)?large|inherit|initial|revert|revert-layer|unset)$/i,
  fontWeight:
    /^(normal|bold|lighter|bolder|inherit|initial|revert|revert-layer|unset)$|^[1-9]00$/i,
  fontStyle:
    /^(normal|italic|oblique( [123]?\d{1,2}deg)?|inherit|initial|revert|revert-layer|unset)$/i,
  lineHeight:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)?|\d+%|normal|inherit|initial|revert|revert-layer|unset)$/i,
  letterSpacing:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)|normal|0|inherit|initial|revert|revert-layer|unset)$/i,
};
