export const customizeOptions = {
  palette: [
    'background',
    'primary',
    'primaryLight',
    'secondary',
    'secondaryLight',
    'greyLight',
    'darkGrey',
    'nearBlack',
    'text',
  ],
  typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'],
};

export const predefinedFonts = ['Lato', 'Montserrat', 'Roboto'];

export const propRules = {
  color:
    /^#([a-f0-9]{6}|[a-f0-9]{3})$|^rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)$/i,
  fontFamily:
    /^((\w+(-\w+)?|inherit|initial|revert|revert-layer|unset)(, )?)+$/i,
  fontSize:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)|\d{1,2}%|smaller|larger|medium|(x{1,2}-)?small|(x{1,3}-)?large|inherit|initial|revert|revert-layer|unset)$/i,
  fontWeight:
    /^(normal|bold|lighter|bolder|inherit|initial|revert|revert-layer|unset)$/i,
  fontStyle:
    /^(normal|italic|oblique( [123]?\d{1,2}deg)?|inherit|initial|revert|revert-layer|unset)$/i,
  lineHeight:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)?|\d+%|normal|inherit|initial|revert|revert-layer|unset)$/i,
  letterSpacing:
    /^-?(?:\d+(\.\d+)?(px|rem|em|ex)|normal|inherit|initial|revert|revert-layer|unset)$/i,
};
