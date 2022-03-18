import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ColorSwatch from './ColorSwatch';
import TypographyTable from './TypographyTable';

const colorData = ['primary', 'secondary'];
const textColorData = ['darkGrey', 'grey', 'nearBlack'];
const dynamicTextColorData = ['primary', 'secondary', 'disabled'];

function DesignSandbox() {
  const theme = useTheme();
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
    </Stack>
  );
}

export default DesignSandbox;
