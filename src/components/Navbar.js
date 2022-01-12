import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { makeStyles } from 'models/makeStyles';
import Link from './Link';

const iconLogo = '/images/greenstand_logo.svg';
const logo = '/images/greenstand_logo_full.png';

const useStyles = makeStyles()((theme) => ({
  navContainer: {
    backgroundColor: theme.palette.background.default,
    height: theme.spacing(18),
    width: '100vw',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 9999,
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
  },
  buttonStyle: {
    fontSize: '16px',
    textTransform: 'none',
    color: theme.palette.textPrimary.main,
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
    <AppBar className={classes.navContainer} color="primary" position="static">
      <Link href="/" className={classes.logo}>
        <Image
          src={isMobileScreen ? iconLogo : logo}
          width={isMobileScreen ? 24 : 180}
          height={30}
        />
      </Link>
      <Toolbar variant="dense" className={classes.toolbar}>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Greenstand
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Partnerships
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Treetracker
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Contribute
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Sevices
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Blog
          </Button>
        </Link>
        <Link href="/">
          <Button className={classes.buttonStyle} variant="text">
            Contact Us
          </Button>
        </Link>
      </Toolbar>
      <Button
        className={classes.menuButton}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon fontSize="large" />
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
      </Menu>
    </AppBar>
  );
}

export default Navbar;
