import { SvgIcon } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import WorldMap from 'react-world-map';
import { makeStyles } from 'models/makeStyles';
import { useMobile } from '../hooks/globalHooks';
import TreeTooltip from '../img/tree_tooltip.svg';

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
          fill: theme.palette.primaryLight.main,
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

const mapContinentName = (continentName) => {
  if (!continentName) return undefined;

  const nameArray = continentName.toLowerCase().split(' ');
  if (nameArray.length > 1) {
    return nameArray[0][0] + nameArray[1][0];
  }
  if (nameArray.length === 1) {
    return nameArray[0][0] + nameArray[0][1];
  }

  return undefined;
};

function ToolTip({ totalTrees, con }) {
  const { classes } = useStyles();
  const isMobile = useMobile();

  return (
    <Box
      className={classes.tooltipImg}
      sx={{
        position: 'absolute',
        top: isMobile ? mobileToolTipPos[con].top : toolTipPos[con].top,
        left: isMobile ? mobileToolTipPos[con].left : toolTipPos[con].left,
      }}
    >
      <SvgIcon
        sx={{ width: 68, height: 77 }}
        component={TreeTooltip}
        alt="tree icon"
        inheritViewBox
      />
      <Typography
        color="nearBlack.main"
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

  let contArr = con;
  let totalTreesArr = totalTrees;

  if (!Array.isArray(totalTrees) && !Array.isArray(con)) {
    contArr = [con];
    totalTreesArr = [totalTrees];
  }
  const continentAbr = contArr.map((c) => mapContinentName(c));

  return (
    <Box className={classes.root}>
      <WorldMap selected={continentAbr} onSelect={() => null} />
      {continentAbr.map((cont, ind) => (
        <ToolTip
          key={cont}
          totalTrees={totalTreesArr[ind]}
          pos={toolTipPos}
          con={cont}
        />
      ))}
    </Box>
  );
}

export default CustomWorldMap;
