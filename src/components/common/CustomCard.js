import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Icon from './CustomIcon';

function CustomCard({
  iconURI,
  title,
  text,
  handleClick,
  disabled,
  tooltip,
  iconProps,
}) {
  return (
    <Box
      onClick={handleClick}
      elevation={0}
      sx={{
        background: ({ palette }) =>
          disabled ? palette.grey[300] : palette.background.greenGradient,
        backgroundColor: disabled ? '' : 'common.white',
        borderRadius: [2, 4],
        p: [3, 6],
        display: 'flex',
        cursor: handleClick ? 'pointer' : 'inherit',
        alignItems: 'center',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{}}>
        <Avatar
          sx={{
            width: [36, 60],
            height: [36, 60],
            bgcolor: 'background.paper',
            boxShadow: disabled ? '' : '0px 6px 12px 0px #585B5D40',
            color: ({ palette }) =>
              disabled
                ? // ? theme.palette.darkGrey.main
                  palette.success.main
                : palette.success.main,
          }}
        >
          <Icon icon={iconURI} width={36} height={36} {...iconProps} />
        </Avatar>
      </Box>
      <Box
        sx={{
          ml: [3, 6],
        }}
      >
        <Typography
          variant="body1"
          color="darkGrey.main"
          sx={{
            display: 'inline-block',
          }}
        >
          {title}
        </Typography>

        {tooltip && (
          <Tooltip title={tooltip}>
            <HelpOutlineIcon
              sx={{
                fontSize: 'small',
                color: '#6B6E70',
                marginLeft: 1,
              }}
            />
          </Tooltip>
        )}

        <Typography
          variant="h2"
          color="nearBlack.main"
          sx={{
            mt: [0.5, 1],
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomCard;
