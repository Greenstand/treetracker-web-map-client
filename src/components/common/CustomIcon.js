import SvgIcon from '@mui/material/SvgIcon';

function CustomIcon({ icon, size = '1em', sx = {}, color }) {
  let formattedSize;

  if (typeof size === 'string') {
    formattedSize = [`calc(0.75 * ${size})`, size];
  } else if (typeof size === 'number') {
    formattedSize = [`calc(0.75 * ${size}px)`, `${size}px`];
  } else if (size instanceof Array) {
    formattedSize = size;
  }

  return (
    <SvgIcon
      component={icon}
      inheritViewBox
      sx={{
        '& path': {
          stroke: color,
        },
        '& rect': {
          stroke: color,
        },
        height: formattedSize,
        width: formattedSize,
        ...sx,
      }}
    />
  );
}

export default CustomIcon;
