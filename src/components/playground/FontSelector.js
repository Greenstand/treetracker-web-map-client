import AddIcon from '@mui/icons-material/Add';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { predefinedFonts } from 'models/themePlaygroundOptions';
import { usePlaygroundFonts } from '../../hooks/contextHooks';

function FontSelector(props) {
  const { handleChange } = props;
  const [fonts, setFonts] = usePlaygroundFonts();
  const defaultFonts = predefinedFonts;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    setAnchorEl(null);
    // prevent passing down event data
    if (typeof value === 'string') handleChange(value);
  };

  return (
    <>
      <AddIcon
        id="font-family-button"
        aria-controls={open ? 'font-family-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
        }}
      />
      <Menu
        id="font-family-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'font-family-button',
        }}
      >
        {Object.keys(fonts).map((font) => (
          <MenuItem
            key={`font-selector-menutitem-${font}`}
            onClick={() => handleClose(font)}
          >
            {font} {!(font in defaultFonts) && <FontDownloadIcon />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default FontSelector;
