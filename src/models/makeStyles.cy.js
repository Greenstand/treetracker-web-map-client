import { Box } from '@mui/material';
import { makeStyles } from 'models/makeStyles';
import { mountWithTheme as mount } from 'models/test-utils';

const backgroundColor = 'rgb(0, 0, 255)';
const textColor = 'rgb(255, 255, 255)';

const useStyles = makeStyles()(() => ({
  box: {
    backgroundColor,
  },
}));

function JssComponent({ children }) {
  const { classes } = useStyles();
  return (
    <Box id="JssComponent" className={classes.box}>
      {children}
    </Box>
  );
}

function SxComponent({ children }) {
  return (
    <Box id="SxComponent" sx={{ color: textColor }}>
      {children}
    </Box>
  );
}

function SxJssComponent({ children }) {
  const { classes } = useStyles();
  return (
    <Box id="SxJssComponent" className={classes.box} sx={{ color: textColor }}>
      {children}
    </Box>
  );
}

describe('BackButton', () => {
  it('renders with makestyles', () => {
    mount(<JssComponent>text: black, bg: {backgroundColor}</JssComponent>);
    cy.get('[id="JssComponent"]')
      .invoke('css', 'backgroundColor')
      .should('equal', backgroundColor);
  });

  it('renders with sx', () => {
    mount(<SxComponent>text: {textColor}, bg: none</SxComponent>);
    cy.get('[id="SxComponent"]')
      .invoke('css', 'color')
      .should('equal', textColor);
  });

  it('renders with makestyles and sx', () => {
    mount(
      <SxJssComponent>
        text: {textColor}, bg: {backgroundColor}
      </SxJssComponent>,
    );
    cy.get('[id="SxJssComponent"]')
      .invoke('css', 'backgroundColor')
      .should('equal', backgroundColor);
    cy.get('[id="SxJssComponent"]')
      .invoke('css', 'color')
      .should('equal', textColor);
  });
});
