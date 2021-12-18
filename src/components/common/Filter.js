import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import React from 'react';
import log from 'loglevel';

const useStyles = makeStyles()((theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'Montserrat',

    fontSize: '32px',
    color: theme.palette.textPrimary.main,
  },
  filterButtonText: {
    textTransform: 'none',
    fontSize: '16px',
    fontFamily: 'Lato',
    letterSpacing: '1.5px',
    marginLeft: '8px',
  },

  container: {
    marginTop: theme.spacing(12),
  },

  row: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  inputLabel: {
    color: theme.palette.textPrimary.main,
    fontFamily: 'Lato',
    letterSpacing: '0.5px',
  },
  spaceBetween: {
    marginRight: theme.spacing(5),
  },
  spaceBelow: {
    marginBottom: theme.spacing(5),
  },
  plantDateTitle: {
    fontFamily: 'Lato',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  dateFieldContainer: {
    marginTop: theme.spacing(5),
  },
  dateField: {
    borderBottom: 'none !important',
    border: '1px solid #C4C4C4',
    borderRadius: '4px',
  },
}));

function Filter(props) {
  const { onFilter } = props;
  const { classes } = useStyles();
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [toggle, setToggle] = React.useState(true);
  const [isError, setError] = React.useState(false);
  const [onSubmit, setSubmit] = React.useState(false);

  const START_DATE = new Date(startDate);
  const END_DATE = new Date(endDate);

  const END_DATE_TIME_TO_MILLISECONDS = END_DATE.getTime();
  const START_DATE_TIME_TO_MILLISECONDS = START_DATE.getTime();

  const DATES_IS_TRUE = !startDate || !endDate;
  const DATES_IS_FALSE = startDate && endDate;

  const START_DATE_IS_TRUE = startDate;
  const END_DATE_IS_TRUE = endDate;

  const CONDITIONS =
    !START_DATE_TIME_TO_MILLISECONDS ||
    !END_DATE_TIME_TO_MILLISECONDS ||
    END_DATE_TIME_TO_MILLISECONDS === START_DATE_TIME_TO_MILLISECONDS ||
    START_DATE_TIME_TO_MILLISECONDS > END_DATE_TIME_TO_MILLISECONDS ||
    END_DATE_TIME_TO_MILLISECONDS < START_DATE_TIME_TO_MILLISECONDS;

  const IS_CLOSED = toggle === false && !onSubmit;

  const IS_OPENED = onFilter && toggle === true;

  const IS_SUBMITTED =
    onSubmit &&
    DATES_IS_FALSE &&
    toggle === false &&
    START_DATE_IS_TRUE &&
    END_DATE_IS_TRUE;

  const handleToggle = () => {
    setToggle((prev) => !prev);
    if (toggle === false) {
      setStartDate('');
      setEndDate('');
      setError(false);
      setSubmit(false);
    }
  };

  const handleCancel = () => {
    setSubmit(false);
    setToggle(false);
  };

  const handleDates = () => {
    if (CONDITIONS) {
      setError(true);
      setToggle(true);
    } else {
      setError(false);
      setToggle(false);
    }
  };

  function handleSubmit() {
    log.log('submit');
    setToggle(false);
    handleDates();
    if (!isError) {
      setSubmit(true);
      onFilter({
        startDate,
        endDate,
      });
    }
  }
  return (
    <Box sx={{ width: 1 }}>
      <form>
        <Box className={classes.title}>
          <Typography className={classes.titleText}></Typography>
          <Button
            variant="contained"
            color="secondary"
            className={classes.filterButton}
            onClick={() => handleToggle()}
          >
            <FilterListRoundedIcon fontSize="small" />
            <Typography className={classes.filterButtonText}>
              {IS_CLOSED && `Filters is  closed`}
              {IS_OPENED && `Filters is  open`}
              {IS_SUBMITTED && `Filters is ${startDate} / ${endDate}`}
            </Typography>
          </Button>
        </Box>
        {toggle === true && (
          <Box className={classes.container}>
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.plantDateTitle}>
                  Planted between (timeline)
                </Typography>
              </Grid>
              <Grid item container sx={{ mt: 5 }} columnSpacing={{ xs: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    error={isError}
                    className={` ${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
                    color="secondary"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    sx={{ width: 1 }}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    error={isError}
                    className={` ${classes.textField}`}
                    color="secondary"
                    InputLabelProps={{
                      shrink: true,
                      className: classes.inputLabel,
                    }}
                    sx={{ width: 1 }}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ gap: 2, display: 'flex', justifyContent: 'end' }}>
              <Button variant="text" onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={DATES_IS_TRUE}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </form>
    </Box>
  );
}

export default Filter;
