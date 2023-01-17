import {
  AppBar,
  Button,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import MenuBar from 'images/MenuBar';
import { makeStyles } from 'models/makeStyles';
import ChangeThemeButton from './ChangeThemeButton';
import Link from './Link';
import { useMobile } from '../hooks/globalHooks';

const iconLogo = `${process.env.NEXT_PUBLIC_BASE}/images/greenstand_logo.svg`;

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
    // boxShadow:
    //   '0px 20px 17px -14px rgb(0 0 0 / 32%), 0px 10px 15px 1px rgb(0 0 0 / 14%), 0px 10px 20px 3px rgb(0 0 0 / 12%)',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
      alignItems: 'flex-end',
    },
  },
  toolbar: {
    gap: 25,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    paddingLeft: '1rem',
    paddingBottom: '.5rem',
    display: 'flex',
    alignItems: 'flex-end',
  },
  buttonStyle: {
    fontSize: '16px',
    textTransform: 'none',
  },
  menuButton: {
    display: 'none',
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
}));

function Navbar({ config }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMobile();

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
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              m: 4,
            }}
          >
            <Image
              src={iconLogo}
              width={24}
              height={30}
              alt="Greenstand Logo"
            />
          </Box>
        )}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'baseline',
            }}
          >
            {/* <Image
              src={iconLogo}
              width={24}
              height={30}
              alt="Greenstand Logo"
            /> */}
            <Typography
              variant="h1"
              ml={2.5}
              color="primary"
              sx={{
                // color: '#61892F',
                fontSize: 30,
                fontWeight: 900,
                lineHeight: '37px',
                letterSpacing: '0.2px',
              }}
            >
              Treetracker
            </Typography>
            <Typography
              variant="h6"
              ml={2.5}
              color="text.secondary"
              sx={{
                fontWeight: 900,
                lineHeight: '22px',
              }}
            >
              by Greenstand
            </Typography>
          </Box>
        )}
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
        {' '}
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
