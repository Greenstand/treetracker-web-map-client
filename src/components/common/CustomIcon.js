import SvgIcon from '@mui/material/SvgIcon';

function CustomIcon({ icon, height = '1em', width = '1em', sx = {}, color }) {
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
        height: [28, height],
        width: [28, width],
        ...sx,
      }}
    />
  );
}

export default CustomIcon;
