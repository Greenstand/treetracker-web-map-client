import { Box, Typography, InputBase, Divider, Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker as MUIMobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useMapContext } from 'mapContext';
import Icon from './common/CustomIcon';
import { useMobile } from '../hooks/globalHooks';
import TimeIcon from '../images/icons/time.svg';
import { nextPathBaseDecode } from '../models/utils';

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
      {label && <Typography color="text.primary">{label}</Typography>}
      <InputBase
        placeholder={label}
        ref={inputRef}
        sx={{
          width: [72, 96],
        }}
        {...inputProps}
      />
      {InputProps?.endAdornment}
    </Box>
  );
}

function DesktopDatePicker({ value, onChange, label }) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      maxDate={Date.now()}
      renderInput={CustomInput}
    />
  );
}

function MobileDatePicker({ value, onChange }) {
  return (
    <MUIMobileDatePicker
      value={value}
      onChange={onChange}
      maxDate={Date.now()}
      renderInput={CustomInput}
    />
  );
}

function Timeline() {
  const router = useRouter();
  const isMobile = useMobile();
  const [showPicker, setShowPicker] = useState(false);
  const [timeFrame, setTimeFrame] = useState({
    start: Date.now(),
    end: Date.now(),
  });
  const { map } = useMapContext();
  const path = nextPathBaseDecode(
    router.pathname,
    process.env.NEXT_PUBLIC_BASE,
  );
  const isGlobalPage = /^(?:\/top|\/)$/g.test(path);

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  const handleDatePickerChange = (newValue, frameType) => {
    // check if the start date is before the end date
    const start = frameType === 'start' ? newValue : timeFrame.start;
    const end = frameType === 'end' ? newValue : timeFrame.end;
    if (start > end) return;

    setTimeFrame((prevTimeFrame) => ({
      ...prevTimeFrame,
      [frameType]: newValue,
    }));
  };

  useEffect(() => {
    if (!map) return;
    const startFormatted = moment(timeFrame.start).format('YYYY-MM-DD');
    const endFormatted = moment(timeFrame.end).format('YYYY-MM-DD');

    map.setFilters({ timeline: `${startFormatted}_${endFormatted}` });
  }, [timeFrame]);

  return (
    isGlobalPage && (
      <Paper
        elevation={7}
        sx={{
          position: 'absolute',
          zIndex: ['996', '9999'], // 996 is same as used for zoom buttons
          bottom: '0px',
          left: '0px',
          margin: '20px',
          mb: isMobile ? 'calc(2rem + 25px)' : null, // currently based on the zoom buttons
          pr: showPicker && '15px',
          height: 52,
          borderRadius: 4,
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
            WebkitTapHighlightColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon
            icon={TimeIcon}
            width={22}
            sx={{
              '& path': {
                fill: ({ palette }) => palette.primary.main,
              },
            }}
          />
        </Box>
        {showPicker && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {!isMobile ? (
                <>
                  <DesktopDatePicker
                    value={timeFrame.start}
                    onChange={(newValue) =>
                      handleDatePickerChange(newValue, 'start')
                    }
                    label="Start"
                  />
                  <Divider sx={{ height: 36 }} orientation="vertical" />
                  <DesktopDatePicker
                    value={timeFrame.end}
                    onChange={(newValue) =>
                      handleDatePickerChange(newValue, 'end')
                    }
                    label="End"
                  />
                </>
              ) : (
                <>
                  <MobileDatePicker
                    value={timeFrame.start}
                    onChange={(newValue) =>
                      handleDatePickerChange(newValue, 'start')
                    }
                    label="Start"
                  />
                  <Typography
                    sx={{
                      color: 'text.primary',
                    }}
                  >
                    to
                  </Typography>
                  <MobileDatePicker
                    value={timeFrame.end}
                    onChange={(newValue) =>
                      handleDatePickerChange(newValue, 'end')
                    }
                    label="End"
                  />
                </>
              )}
            </Box>
          </LocalizationProvider>
        )}
      </Paper>
    )
  );
}

export default Timeline;
