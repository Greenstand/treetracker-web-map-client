import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
import { makeStyles } from 'models/makeStyles';
import React from 'react';

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
  const [startDateState, setStartDateState] = React.useState('');
  const [endDateState, setEndDateState] = React.useState('');
  const [toggle, setToggle] = React.useState(true);
  const [isError, setError] = React.useState(false);
  const [onSubmit, setSubmit] = React.useState(false);

  const formatTheDates = (date) => {
    const newDate = new Date(date);
    const day = `0${newDate.getDate()}`.slice(-2);
    const month = `0${newDate.getMonth() + 1}`.slice(-2);
    const year = newDate.getFullYear();

    return `${year}-${month}-${day}`;
  };
  const FORMAT_START_DATE = new Date(startDateState);
  const FORMAT_END_DATE = new Date(endDateState);

  const START_DATE = formatTheDates(FORMAT_START_DATE);
  const END_DATE = formatTheDates(FORMAT_END_DATE);

  const formatTheDatesForBetterView = (date) => {
    const newDate = new Date(date);
    const day = `0${newDate.getDate()}`.slice(-2);
    const month = `0${newDate.getMonth() + 1}`.slice(-2);
    const year = newDate.getFullYear();

    return `${year}/${month}/${day}`;
  };

  const END_DATE_TIME_TO_MILLISECONDS = FORMAT_END_DATE.getTime();
  const START_DATE_TIME_TO_MILLISECONDS = FORMAT_START_DATE.getTime();

  const DATES_IS_TRUE = !startDateState || !endDateState;
  const DATES_IS_FALSE = startDateState && endDateState;

  const START_DATE_IS_TRUE = startDateState;
  const END_DATE_IS_TRUE = endDateState;

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
      setStartDateState('');
      setEndDateState('');
      setError(false);
      setSubmit(false);
    }
  };
  const handleChangeEndDateState = (newValue) => {
    setEndDateState(newValue);
  };
  const handleChangeStartDateState = (newValue) => {
    setStartDateState(newValue);
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

  const handleSubmit = () => {
    log.log('submit');
    setToggle(false);
    handleDates();
    if (isError !== true) {
      setSubmit(true);
      const startDate = START_DATE;
      const endDate = END_DATE;
      onFilter({ startDate, endDate });
    }
  };

  return (
    <Box sx={{ width: 1 }}>
      <form onSubmit={handleSubmit}>
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
              {IS_SUBMITTED &&
                `Filters are ${formatTheDatesForBetterView(
                  startDateState,
                )} - ${formatTheDatesForBetterView(endDateState)}`}
            </Typography>
          </Button>
        </Box>
        {toggle === true && (
          <Box className={classes.container} data-cy="hidden">
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.plantDateTitle}>
                  Planted between (timeline)
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item container sx={{ mt: 5 }} columnSpacing={{ xs: 2 }}>
                  <Grid item sm={6}>
                    <DesktopDatePicker
                      label="Start Date"
                      inputFormat="yyyy-MM-dd"
                      className={` ${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
                      value={startDateState}
                      onChange={handleChangeStartDateState}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Start Date"
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
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DesktopDatePicker
                      label="End Date"
                      inputFormat="yyyy-MM-dd"
                      value={endDateState}
                      onChange={handleChangeEndDateState}
                      renderInput={(params) => (
                        <TextField
                          {...params}
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
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
