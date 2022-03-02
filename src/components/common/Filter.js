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
import { useEffect, useState } from 'react';
import { formatDates } from 'models/utils';

function Filter(props) {
  const { onFilter, isFilterOpenInitial } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(
    isFilterOpenInitial || false,
  );
  const [isError, setIsError] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // const formatDates = (date) =>
  //   moment(date, 'ddd MMM DD YYYY HH:mm:ss').format('YYYY-MM-DD');

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
      const a = formatDates(startDate, 'YYYY-MM-DD');
      const b = formatDates(endDate, 'YYYY-MM-DD');
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
        startDate: formatDates(startDate, 'YYYY-MM-DD'),
        endDate: formatDates(endDate, 'YYYY-MM-DD'),
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
          <Typography variant="h3">Featured Trees</Typography>
          <Button
            variant={isFilterOpen ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              px: [2, 3],
              py: [2.25, 2.875],
              fontSize: [12, 16],
              textTransform: 'none',
            }}
            onClick={() => isHandleFilterIsOpen()}
          >
            <FilterListRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            Filters
            {onSubmit &&
              ` are ${formatDates(startDate, 'YYYY-MM-DD')} / ${formatDates(
                endDate,
                'YYYY-MM-DD',
              )}`}
          </Button>
        </Box>
        {isFilterOpen && (
          <Box mt={12} data-cy="hidden">
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ letterSpacing: '0.04em' }}>
                  Planted between
                </Typography>
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid
                  item
                  container
                  sx={{ mt: 5 }}
                  columnSpacing={{ xs: 2 }}
                  wrap="nowrap"
                >
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
                          color="secondary"
                          error={isError}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{
                            width: 1,
                            fontFamily: 'Lato',
                            letterSpacing: '0.5px',
                            '& input': {
                              color: 'text.secondary',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item sm={6}>
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
                          }}
                          sx={{
                            width: 1,
                            fontFamily: 'Lato',
                            letterSpacing: '0.5px',
                            '& input': {
                              color: 'text.secondary',
                            },
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
          Start date: {formatDates(startDate, 'YYYY-MM-DD')} is bigger than end
          date: {formatDates(endDate, 'YYYY-MM-DD')}
        </Alert>
      )}
    </Box>
  );
}

export default Filter;
