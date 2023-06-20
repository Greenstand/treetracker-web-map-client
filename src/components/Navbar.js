import {
  AppBar,
  Button,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useConfigContext } from 'context/configContext';
import { useCustomThemeContext } from 'hooks/contextHooks';
import { useMobile } from 'hooks/globalHooks';
import MenuBar from 'images/MenuBar';
import { makeStyles } from 'models/makeStyles';
import ChangeThemeButton from './ChangeThemeButton';
import Link from './Link';

const treeTrackerLogo = `/images/treetracker_logo.svg`;
const treeTrackerLogoWhite = `/images/treetracker_logo_white.svg`;

const useStyles = makeStyles()((theme) => ({
  navContainer: {
    height: theme.spacing(18),
    width: '100vw',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 9999,
  },
  toolbar: {
    gap: 25,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    paddingBottom: '.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  buttonStyle: {
    fontSize: '16px',
    textTransform: 'none',
  },
  menuButton: {
    display: 'none',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 'fit-content',
    },
  },
}));

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMobile();
  const { navbar: config } = useConfigContext();

  const { theme } = useCustomThemeContext();

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { classes } = useStyles();
  return (
    <AppBar
      elevation={4}
      className={classes.navContainer}
      color="default"
      position="static"
    >
      <Link href="/" className={classes.logo}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'baseline',
            gap: theme.spacing(2),
            width: 'max-content',
          }}
        >
          <img
            src={
              theme.palette.mode === 'light'
                ? treeTrackerLogo
                : treeTrackerLogoWhite
            }
            width={217}
            height={35}
            alt="Treetracker Logo"
          />
          {!isMobile ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 900,
                lineHeight: '22px',
              }}
            >
              by Greenstand
            </Typography>
          ) : null}
        </Box>
      </Link>
      <Toolbar variant="dense" className={classes.toolbar}>
        {config?.items.map((item) => (
          <Link key={`nav-${item.title}`} target="_blank" href={item.url}>
            <Button className={classes.buttonStyle} variant="text">
              <Typography className={classes.buttonStyle}>
                {item.title}
              </Typography>
            </Button>
          </Link>
        ))}
        <ChangeThemeButton />
      </Toolbar>
      <Button
        className={classes.menuButton}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
      >
        <MenuBar />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          style: {
            marginTop: 40,
          },
        }}
      >
        {config?.items.map((item) => (
          <MenuItem key={`nav-${item.title}`}>
            <Link href={item.url}>{item.title}</Link>
          </MenuItem>
        ))}
        <MenuItem onClick={handleClose} sx={{ paddingLeft: '10px' }}>
          <ChangeThemeButton />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
// test
