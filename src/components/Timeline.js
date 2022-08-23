import { Box, SvgIcon, Typography, InputBase, Divider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import TimeIcon from '../images/icons/time.svg';

function CustomInput({ label, inputRef, inputProps, InputProps }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '.MuiInputAdornment-root': {
          ml: 0,
        },
      }}
    >
      <Typography color="text.primary">{label}</Typography>
      <InputBase
        placeholder={label}
        ref={inputRef}
        sx={{
          width: 96,
        }}
        {...inputProps}
      />
      {InputProps?.endAdornment}
    </Box>
  );
}

function CustomDatePicker({ value, onChange, label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={CustomInput}
      />
    </LocalizationProvider>
  );
}

function Timeline() {
  const [showPicker, setShowPicker] = useState(false);
  const [timeFrame, setTimeFrame] = useState({
    start: Date.now(),
    end: Date.now(),
  });

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  const handleDatePickerChange = (newValue, frameType) => {
    setTimeFrame((prevTimeFrame) => ({
        ...prevTimeFrame,
        [frameType]: newValue,
      }));
  };

  return (
    <Box
        sx={{
          position: 'absolute',
          zIndex: '9999',
          bottom: '0px',
          left: '0px',
          margin: '20px',
          pr: showPicker && '15px',
          height: 52,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          boxSizing: 'border-box',
        }}
      >
        <Box
          onClick={togglePicker}
          sx={{
            height: 52,
            width: 52,
            borderRadius: 4,
            background: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <SvgIcon
            component={TimeIcon}
            sx={{
              width: 22,
              '& path': {
                fill: ({ palette }) => palette.primary.main,
              },
            }}
            inheritViewBox
          />
        </Box>
        {showPicker && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <CustomDatePicker
              value={timeFrame.start}
              onChange={(newValue) => handleDatePickerChange(newValue, 'start')}
              label="Start"
            />
            <Divider sx={{ height: 36 }} orientation="vertical" />
            <CustomDatePicker
              value={timeFrame.end}
              onChange={(newValue) => handleDatePickerChange(newValue, 'end')}
              label="End"
            />
          </Box>
        )}
      </Box>
  );
}

export default Timeline;
