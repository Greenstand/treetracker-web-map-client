import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import WorldMap from 'react-world-map';
import { makeStyles } from 'models/makeStyles';
import TreeTooltip from '../images/tree_tooltip.svg';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'relative',
    '& div': {
      '& svg': {
        width: '100%',
        '& .map-unselected': {
          fill: '#cccccc',
        },
        '& .map-selected': {
          fill: theme.palette.secondary.main,
        },
        '& .map-selected:hover, .map-unselected:hover': {
          cursor: 'pointer',
        },
      },
    },
  },
  tooltipImg: {
    [theme.breakpoints.down('md')]: {
      width: '52px',
    },
  },
}));

function ToolTip({ totalTrees, positionObj }) {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { classes } = useStyles();

  return (
    <Box
      sx={{
        position: 'absolute',
        left:
          positionObj.continentPos.left + positionObj.continentPos.width / 2,
        top: positionObj.continentPos.top - positionObj.mapPos.top,
        transform: isMobileScreen
          ? `translate(-80%, -40%)`
          : `translate(-50%, -10%)`,
      }}
    >
      <img src={TreeTooltip} alt="tree icon" className={classes.tooltipImg} />
      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
        }}
      >
        {totalTrees}
      </Typography>
    </Box>
  );
}

function CustomWorldMap({ totalTrees }) {
  const { classes } = useStyles();
  const [selected, onSelect] = React.useState(null);
  const [positionObj, setPositionObj] = React.useState(null);

  const handleClick = (e) => {
    // disable clicking on "water", or the tooltip itself
    if (e.target.nodeName !== 'path') return;
    // Get position of map container, we need this data because the map is not at the top of the viewport, we need the top of the map to be able to position the tooltip
    const mapPos = e.target.closest('.row').getBoundingClientRect();
    // Get position of clicked continent
    const continentPos = e.target.parentElement.getBoundingClientRect();
    setPositionObj({ mapPos, continentPos });
  };

  React.useEffect(() => {
    if (!selected) setPositionObj(null);
  }, [selected]);

  return (
    <Box className={classes.root} onClick={handleClick}>
      <WorldMap selected={selected} onSelect={onSelect} />
      {positionObj && (
        <ToolTip totalTrees={totalTrees} positionObj={positionObj} />
      )}
    </Box>
  );
}

export default CustomWorldMap;
