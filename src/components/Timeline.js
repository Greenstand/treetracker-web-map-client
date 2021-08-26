import log from "loglevel";
import React from "react";
import TimelapseTwoToneIcon from '@material-ui/icons/TimelapseTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import Grid from "@material-ui/core/Grid";
import {withStyles, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Slider from '@material-ui/core/Slider';
import moment from "moment";
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

const TimelineSlider = withStyles({
  root: {
    color: '#85c232',
    height: 8,
    "& .MuiSlider-markLabel" :{
      color: "white",
    },
    "& .MuiSlider-markLabelActive": {
      color: "white",
    },
    "& .MuiSlider-markActive": {
      backgroundColor: "transparent",
      display: "none",
    },
    "& .MuiSlider-mark": {
      backgroundColor: "transparent",
      display: "none",
    },
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff', //white
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const useStylesTooltip = makeStyles(theme => ({
  popper: {
    opacity: .5,
  },
}));

function ValueLabelComponent(props) {
  const { children, open, value } = props;
  const classes = useStylesTooltip();

  return (
    <Tooltip open={open} classes={{popper:classes.popper}} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    background: 'linear-gradient(90deg, rgba(2,0,36,0.70) 10%, rgba(11,11,94,0.41360294117647056) 19%, rgba(203,209,209,0) 37%)',
    height: '57px',
    width: '40%',
    color: "#ffff", //white Timeline
    //'user-select': "none",
    pointerEvents: "none",

    zIndex: 9,
    position: "fixed",
    bottom: 0,
    [theme.breakpoints.down('xs')]: {
      left: -5,
    },
  },
  box1: {
    pointerEvents: "none",
    width: theme.spacing(80),
    flexWrap: "nowrap",
  },
  box2: {
    pointerEvents: "all",
    padding: theme.spacing(1),
  },
  box3: {
    pointerEvents: "all",
    minWidth: theme.spacing(120),
    [theme.breakpoints.down('xs')]: {
      minWidth: theme.spacing(40),
    },
  },
}));

const dayRange = Math.round(moment.duration(moment().diff(moment("2015-01-01"))).as("d"));

const marks = ['2015',  '2017',  '2019',  '2021'].map(e => {
  return ({
    label: e,
    value: Math.round(moment.duration(moment(`${e}-01-01`).diff(moment(`2015-01-01`))).as("d")),
  });
});

function valuetext(value) {
  return moment('2015-01-01').add(value, "days").format("YYYY-MM-DD");
}

function textvalue(begin, end){
  return [
    Math.round(moment.duration(moment(begin).diff(moment("2015-01-01"))).as("d")),
    Math.round(moment.duration(moment(end).diff(moment("2015-01-01"))).as("d")),
  ];
}

function Timeline(props){
  const classes = useStyles();
  const [slide, setSlide] = React.useState(false);

  function handleClick(){
    setSlide(!slide);

    /* Hidden the Timeline title  */
    document.getElementById("txtTimeline").style.display= 'none';
       
    if(slide){
      /* Show up the Timeline title */
      document.getElementById("txtTimeline").style.display= '';
    
      setValue([0, dayRange]);
      props.onClose && props.onClose();
    }
    
  }


  const [value, setValue] = React.useState([0, dayRange]);
  console.warn("value:", value);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = (e, value) => {
    log.debug("trigger change commit:", value);
    props.onDateChange && props.onDateChange(value.map(e => valuetext(e)));
  };

  React.useEffect(() => {
    if(props.date){
      setSlide(true);
      setValue(textvalue(...props.date));
    }
  },[props.date]);

  return(
    <>
      <div className={classes.root} >
        <Grid 
          container
          alignItems="center"
          className={classes.box1}
        > 
          <Grid item  className={classes.box2} >
          
            <Tooltip title="Timeline">
              <IconButton id="iconButton" onClick={handleClick} >
              {slide?
                <CancelTwoToneIcon fontSize="large" color="primary" />
                :
                <TimelapseTwoToneIcon fontSize="large" color="primary" />
              }
              </IconButton>
            </Tooltip>

          </Grid>

          <Grid item  className={classes.box3} >
          <span id="txtTimeline" className="text">Timeline</span>
            {slide &&
              <TimelineSlider
              min={0}
              max={dayRange}
              value={value}
              onChange={handleChange}
              onChangeCommitted={handleChangeCommitted}
              aria-labelledby="range-slider"
              getAriaValueText={valuetext}
              valueLabelFormat={valuetext}
              marks={marks}
              valueLabelDisplay="on"
              ValueLabelComponent={ValueLabelComponent}
            />
            }
          </Grid>
        </Grid>
        
      </div>
    </>
  );
}

export default Timeline;
