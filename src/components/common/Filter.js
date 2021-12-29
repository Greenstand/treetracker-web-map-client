import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'models/makeStyles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles()((theme) => ({
  inputLabel: {
    color: theme.palette.textPrimary.main,
    fontFamily: 'Lato',
    letterSpacing: '0.5px',
  },
}));

function Filter(props) {
  const { onFilter } = props;
  const { classes } = useStyles();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isError, setIsError] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const formatDates = (date) =>
    moment(date, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD');

  useEffect(() => {
    setIsButtonDisable(!startDate || !endDate);
  }, [startDate, endDate]);

  const isHandleFilterIsOpen = () => {
    setIsFilterOpen((prev) => !prev);

    if (!isFilterOpen) {
      setIsError(false);
      setOnSubmit(false);
    }
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const handleCancel = () => {
    setOnSubmit(false);
    setIsFilterOpen(false);
    setStartDate('');
    setEndDate('');
    setIsFilterOpen(false);
    setIsError(false);
  };

  const handleSubmit = () => {
    setIsFilterOpen(false);

    if (startDate > endDate) {
      setIsError(true);
      setIsFilterOpen(true);
      const a = formatDates(startDate);
      const b = formatDates(endDate);
      if (a > b) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    } else {
      setIsError(false);
      setIsFilterOpen(false);
      setOnSubmit(true);
      onFilter({
        startDate: formatDates(startDate),
        endDate: formatDates(endDate),
      });
    }
  };

  return (
    <Box sx={{ width: 1 }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'textPrimary.main',
            }}
          >
            Featured Trees
          </Typography>
          <Button
            variant={isFilterOpen ? 'contained' : 'outlined'}
            color="secondary"
            sx={{ color: !isFilterOpen ? 'textPrimary.main' : '' }}
            onClick={() => isHandleFilterIsOpen()}
          >
            <FilterListRoundedIcon fontSize="small" />
            <Typography
              variant="h6"
              pl={2}
              sx={{
                textTransform: 'none',
                fontWeight: 'normal',
              }}
            >
              Filters
              {onSubmit &&
                ` are ${formatDates(startDate)} / ${formatDates(endDate)}`}
            </Typography>
          </Button>
        </Box>
        {isFilterOpen && (
          <Box mt={12} data-cy="hidden">
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ letterSpacing: '0.04em' }}>
                  Planted between (timeline)
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item container sx={{ mt: 5 }} columnSpacing={{ xs: 2 }}>
                  <Grid item sm={6}>
                    <DesktopDatePicker
                      label="Start Date"
                      inputFormat="dd-MM-yyyy"
                      mask="__-__-____"
                      value={startDate}
                      onChange={handleChangeStartDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Start Date"
                          variant="outlined"
                          size="small"
                          error={isError}
                          color="secondary"
                          InputLabelProps={{
                            shrink: true,
                            className: classes.inputLabel,
                          }}
                          sx={{
                            width: 1,
                            fontFamily: 'Lato',
                            color: 'textPrimary.main',
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DesktopDatePicker
                      label="End Date"
                      inputFormat="dd-MM-yyyy"
                      mask="__-__-____"
                      value={endDate}
                      onChange={handleChangeEndDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          error={isError}
                          color="secondary"
                          InputLabelProps={{
                            shrink: true,
                            className: classes.inputLabel,
                          }}
                          sx={{
                            width: 1,
                            fontFamily: 'Lato',
                            color: 'textPrimary.main',
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
            <Box sx={{ gap: 2, display: 'flex', justifyContent: 'end' }} m={3}>
              <Button variant="text" onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                disabled={isButtonDisable}
              >
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </form>
      {showMessage && (
        <Alert severity="warning" sx={{ my: 4 }}>
          Start date: {formatDates(startDate)} is bigger than end date:{' '}
          {formatDates(endDate)}
        </Alert>
      )}
    </Box>
  );
}

export default Filter;
