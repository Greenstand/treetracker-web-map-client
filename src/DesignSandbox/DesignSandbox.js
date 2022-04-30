import { Stack, Box, Typography } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { buildTheme } from 'context/themeContext';
import ColorSwatch from './ColorSwatch';
import TypographyTable from './TypographyTable';

const colorData = ['primary', 'secondary'];
const textColorData = ['darkGrey', 'grey', 'nearBlack'];
const dynamicTextColorData = ['primary', 'secondary', 'disabled'];

function b(theme) {
  const bgData = Object.entries(theme.palette.background).map(
    (entry) => entry[0],
  );
  return (
    <Stack spacing={10}>
      <TypographyTable />
      <ColorSwatch
        title="Color Swatch"
        usage="theme.palette.[color].main"
        data={colorData}
        footnote="Stays the same regardless of theme"
      />
      <ColorSwatch
        title="Text Color Swatch"
        usage="theme.palette.[color].main"
        data={textColorData}
        footnote="Stays the same regardless of theme"
      />
      <ColorSwatch
        title="Dynamic Text Color Swatch"
        usage="theme.palette.text.[color]"
        data={dynamicTextColorData}
        dynamic
        footnote="Changes value based on theme. With dark theme all of them changes to '#eee'. They are the same colors as above, just with a different name."
      />
      <ColorSwatch
        title="Background Swatch"
        usage="theme.palette.background.[color]"
        data={bgData}
        footnote="Stays the same regardless of theme"
      />
      <Box>
        <Typography variant="h2">Grey</Typography>
        <Box>
          {Object.entries(theme.palette.grey).map((entry) => (
            <Box
              key={entry[0]}
              sx={{
                with: 20,
                height: 20,
                backgroundColor: entry[1],
              }}
            >
              {entry[0]}
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}

function DesignSandbox() {
  const theme = buildTheme('light');
  const themeDark = buildTheme('dark');
  console.log('xxx:', theme);

  const box1 = b(theme);
  const box2 = b(themeDark);

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box>{box1}</Box>
      <Box
        sx={{
          color: 'white',
          backgroundColor: 'black',
        }}
      >
        {box2}
      </Box>
    </Box>
  );
}

export default DesignSandbox;
