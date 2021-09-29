import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '../images/greenstand_logo_full.png';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  navContainer: {
    backgroundColor: '#ffffff',
    height: 72,
    width: '100vw',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  toolbar: {
    gap: 25,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  buttonStyle: {
    fontSize: '16px',
    textTransform: 'none',
  },
  menuButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
}));

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = useStyles();
  return (
    <AppBar className={classes.navContainer} color="primary">
      <Image src={logo} width={180} height={30} />
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
        Menu
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
