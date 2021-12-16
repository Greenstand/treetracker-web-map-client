import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
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
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  function handleSubmit() {
    log.log('submit');
    onFilter({
      startDate,
      endDate,
    });
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
          >
            <FilterListRoundedIcon fontSize="small" />
            <Typography className={classes.filterButtonText}>
              Filters
            </Typography>
          </Button>
        </Box>

        <Box className={classes.container}>
          {/* <Box className={`${classes.row}`}>
          <TextField
            select
            label="Tree Species"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
          <TextField
            select
            label="Planting org"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
        </Box>
        <Box className={`${classes.row} `}>
          <TextField
            select
            label="Country"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
          <TextField
            select
            label="City"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
        </Box>
        <Box className={`${classes.row}`}>
          <TextField
            select
            label="Health status"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
          <TextField
            select
            label="Verification status"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBetween} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
          <TextField
            select
            label="Token status"
            variant="outlined"
            size="small"
            className={`${classes.textField} ${classes.spaceBelow}`}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            InputProps={{
              className: classes.inputLabel,
            }}
            color="secondary"
          >
            <MenuItem>todo</MenuItem>
          </TextField>
        </Box> */}
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
            <Button variant="text">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default Filter;
