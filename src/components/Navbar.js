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

function Navbar() {
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
        <Link href="https://greenstand.org/" target="_blank">
          <Button variant="text">
            <Typography className={classes.buttonStyle}>
              About Greenstand
            </Typography>
          </Button>
        </Link>
        <Link
          target="_blank"
          href="https://greenstand.org/treetracker/start-tracking"
        >
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>
              About Treetracker
            </Typography>
          </Button>
        </Link>
        <Link target="_blank" href="https://greenstand.org/contribute/donate">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Contribute</Typography>
          </Button>
        </Link>
        <Link target="_blank" href="https://greenstand.org/blog">
          <Button className={classes.buttonStyle} variant="text">
            <Typography className={classes.buttonStyle}>Blog</Typography>
          </Button>
        </Link>
        <Link target="_blank" href="https://greenstand.org/contact">
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
        <MenuItem>
          <Link href="https://greenstand.org/">About Greenstand</Link>
        </MenuItem>
        <MenuItem>
          <Link href="https://greenstand.org/treetracker/start-tracking">
            About Treetracker
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="https://greenstand.org/contribute/donate">
            Contribute
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="https://greenstand.org/blog">Blog</Link>
        </MenuItem>
        <MenuItem>
          <Link href="https://greenstand.org/contact">Contact Us</Link>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ paddingLeft: '10px' }}>
          <ChangeThemeButton />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
