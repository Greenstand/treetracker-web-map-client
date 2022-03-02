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
    pointerEvents: 'none',
    '& div': {
      '& svg': {
        width: '100%',
        '& .map-unselected': {
          fill: '#cccccc',
        },
        '& .map-selected': {
          fill: theme.palette.secondary.main,
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

/* Tooltip positions based on screen sizes */
const toolTipPos = {
  na: { top: '0%', left: '12%' },
  sa: { top: '40%', left: '18%' },
  af: { top: '25%', left: '43%' },
  eu: { top: '0%', left: '43%' },
  as: { top: '0%', left: '63%' },
  oc: { top: '50%', left: '80%' },
};
const mobileToolTipPos = {
  na: { top: '15%', left: '12%' },
  sa: { top: '40%', left: '17%' },
  af: { top: '30%', left: '41%' },
  eu: { top: '15%', left: '43%' },
  as: { top: '15%', left: '62%' },
  oc: { top: '45%', left: '78%' },
};

function ToolTip({ totalTrees, con }) {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { classes } = useStyles();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: isMobileScreen ? mobileToolTipPos[con].top : toolTipPos[con].top,
        left: isMobileScreen
          ? mobileToolTipPos[con].left
          : toolTipPos[con].left,
      }}
    >
      <img src={TreeTooltip} alt="tree icon" className={classes.tooltipImg} />
      <Typography
        color="textSecondary.main"
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

function CustomWorldMap({ totalTrees, con }) {
  const { classes } = useStyles();
  const [selected, onSelect] = React.useState(con);

  return (
    <Box className={classes.root}>
      <WorldMap selected={selected} onSelect={onSelect} />
      <ToolTip totalTrees={totalTrees} pos={toolTipPos} con={con} />
    </Box>
  );
}

export default CustomWorldMap;
