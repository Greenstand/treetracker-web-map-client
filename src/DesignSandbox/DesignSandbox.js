import { Paper, Tooltip, Divider, Stack, Box, Typography } from '@mui/material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import log from 'loglevel';
import { buildTheme } from 'context/themeContext';
import ColorSwatch from './ColorSwatch';
import TypographyTable from './TypographyTable';

const colorData = ['primary', 'secondary'];
const textColorData = ['darkGrey', 'grey', 'nearBlack'];
const dynamicTextColorData = ['primary', 'secondary', 'disabled'];

function B() {
  const theme = useTheme();
  log.log('theme:', theme);
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
      <Divider />
      <Box>
        <Typography variant="h2">Pallette</Typography>
        {Object.entries(theme.palette)
          .filter((e) => e[1].main)
          .map(([key, value]) => (
            <>
              <Divider />
              <Tooltip title={JSON.stringify(value)}>
                <Typography variant="h3">{key}</Typography>
              </Tooltip>
              <Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: `${key}.main`,
                  }}
                />
                <Typography variant="body1">{`${key}.main`}</Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: `${key}.light`,
                  }}
                />
                <Typography variant="body1">{`${key}.light`}</Typography>
              </Box>
            </>
          ))}
      </Box>
      <Divider />
      <Box>
        <Typography variant="h2">Typography</Typography>
        {[
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'body1',
          'body2',
          'button',
          'caption',
          'subtitle1',
          'subtitle2',
        ].map((t) => (
          <>
            <Divider />
            <Tooltip title={JSON.stringify(theme.typography[t])}>
              <Typography variant={t}>
                Typo{t} {theme.typography[t].fontFamily},
                {theme.typography[t].fontSize}
              </Typography>
            </Tooltip>
          </>
        ))}
      </Box>
    </Stack>
  );
}

function DesignSandbox() {
  const theme = buildTheme('light');
  const themeDark = buildTheme('dark');
  // log.log('theme:', theme);
  // log.log('themeDark:', themeDark);

  // const box1 = b(theme);
  // const box2 = b(themeDark);

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <ThemeProvider theme={theme}>
        <Paper elevation={11}>
          <B />
        </Paper>
      </ThemeProvider>
      <ThemeProvider theme={themeDark}>
        <Paper elevation={11}>
          <B />
        </Paper>
      </ThemeProvider>
    </Box>
  );
}

export default DesignSandbox;
