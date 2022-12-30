export const customizeOptions = {
  palette: {
    themeModeDependend: true,
    options: {
      background: [
        'default',
        'paper',
        'paperDark',
        'greenGradient',
        'OrangeGreenGradient',
      ],
      primary: ['main', 'light', 'dark', 'contrastText'],
      primaryLight: ['main'],
      secondary: ['main', 'light', 'dark', 'contrastText'],
      secondaryLight: ['main'],
      notImportant: ['main'],
      greyLight: ['main', 'contrastText'],
      darkGrey: ['main', 'contrastText'],
      nearBlack: ['main', 'contrastText'],
      text: [
        'primary',
        'primaryReverse',
        'disabled',
        'secondary',
        'text1',
        'text2',
      ],
      error: ['main', 'light', 'dark', 'contrastText'],
      warning: ['main', 'light', 'dark', 'contrastText'],
      info: ['main', 'light', 'dark', 'contrastText'],
      success: ['main', 'light', 'dark', 'contrastText'],
    },
  },
  typography: {
    themeModeDependend: false,
    options: {
      h1: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      h2: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      h3: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      h4: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      h5: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      h6: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      subtitle1: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      subtitle2: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      body1: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      body2: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
      caption: [
        'fontFamily',
        'fontWeight',
        'fontSize',
        'lineHeight',
        'letterSpacing',
      ],
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
