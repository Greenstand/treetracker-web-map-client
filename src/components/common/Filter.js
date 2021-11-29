import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
  textField: {
    maxWidth: '230px',
    minWidth: '210px',
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

function Filter() {
  const classes = useStyles();
  return (
    <form>
      <Box className={classes.title}>
        <Typography className={classes.titleText}>Featured Trees</Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.filterButton}
        >
          <FilterListRoundedIcon fontSize="small" />
          <Typography className={classes.filterButtonText}>Filters</Typography>
        </Button>
      </Box>

      <Box className={classes.container}>
        <Box className={`${classes.row}`}>
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
        </Box>
        <Box>
          <Typography className={classes.plantDateTitle}>
            Planted between
          </Typography>
          <Box className={classes.dateFieldContainer}>
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
            />
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
            />
          </Box>
        </Box>
      </Box>
    </form>
  );
}

export default Filter;
