import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, SvgIcon } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '../../models/makeStyles';

const useStyles = makeStyles()((theme) => ({}));

function CustomCard(props) {
  const { classes } = useStyles(props);
  const theme = useTheme();
  const { iconURI, title, text, handleClick, disabled, tooltip, sx } = props;

  return (
    <Box
      className={classes.root}
      onClick={handleClick}
      elevation={0}
      sx={{
        background: disabled
          ? theme.palette.grey[300]
          : theme.palette.background.greenGradient,
        backgroundColor: disabled ? '' : 'common.white',
        borderRadius: [2, 4],
        p: [3, 6],
        display: 'flex',
        cursor: handleClick ? 'pointer' : 'inherit',
        alignItems: 'center',
      }}
    >
      <Box sx={{}}>
        <Avatar
          className={classes.avatar}
          sx={{
            width: [36, 60],
            height: [36, 60],
            bgcolor: 'background.paper',
            boxShadow: disabled ? '' : '0px 6px 12px 0px #585B5D40',
            color: disabled
              ? // ? theme.palette.darkGrey.main
                theme.palette.success.main
              : theme.palette.success.main,
          }}
        >
          <SvgIcon
            sx={{
              height: [32, 52],
              width: [32, 52],
              ...sx,
              fill: 'none',
            }}
            component={iconURI}
            inheritViewBox
            alt="icon"
          />
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
