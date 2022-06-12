import {
  AppBar,
  Button,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import MenuBar from 'images/MenuBar';
import { makeStyles } from 'models/makeStyles';
import ChangeThemeButton from './ChangeThemeButton';
import Link from './Link';

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

function Navbar() {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
        {isMobileScreen && (
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
        {!isMobileScreen && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'baseline',
            }}
          >
            <Image
              src={iconLogo}
              width={24}
              height={30}
              alt="Greenstand Logo"
            />
            <Typography
              variant="h4"
              ml={2.5}
              color="text.secondary"
              sx={{
                fontWeight: 900,
                lineHeight: '22px',
              }}
            >
              Greenstand
            </Typography>
          </Box>
        )}
      </Link>
      <Toolbar variant="dense" className={classes.toolbar}>
        <Link href="/">
          <Button variant="text">
            <Typography className={classes.buttonStyle}>Greenstand</Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>
              Partnerships
            </Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Treetracker</Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Contribute</Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Sevices</Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Blog</Typography>
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Contact Us</Typography>
          </Button>
        </Link>
        <ChangeThemeButton />
      </Toolbar>
      <Button
        className={classes.menuButton}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {' '}
        <MenuBar />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          style: {
            marginTop: 40,
          },
        }}
      >
        <MenuItem onClick={handleClose}>Greenstand</MenuItem>
        <MenuItem onClick={handleClose}>Partnerships</MenuItem>
        <MenuItem onClick={handleClose}>Treetracker</MenuItem>
        <MenuItem onClick={handleClose}>Contribute</MenuItem>
        <MenuItem onClick={handleClose}>Services</MenuItem>
        <MenuItem onClick={handleClose}>Blog</MenuItem>
        <MenuItem onClick={handleClose}>Contact Us</MenuItem>
        <MenuItem onClick={handleClose} sx={{ paddingLeft: '10px' }}>
          <ChangeThemeButton />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
