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
    log.log('submit');
    setIsFilterOpen(false);

    if (startDate > endDate) {
      setIsError(true);
      setIsFilterOpen(true);
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
    </Box>
  );
}

export default Filter;
