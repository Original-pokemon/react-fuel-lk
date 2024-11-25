import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Button,
  Tooltip,
  Grid2 as Grid,
  IconButton,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CheckIcon from '@mui/icons-material/Check';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoIcon from '@mui/icons-material/Info';

type DateRangePickerProperties = {
  initialStartDate: Dayjs;
  initialEndDate: Dayjs;
  onDateChange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
};

dayjs.locale('ru');

const DateRangePicker: React.FC<DateRangePickerProperties> = ({
  initialStartDate,
  initialEndDate,
  onDateChange,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);

  const [lastAppliedStartDate, setLastAppliedStartDate] =
    useState<Dayjs | null>(initialStartDate);
  const [lastAppliedEndDate, setLastAppliedEndDate] = useState<Dayjs | null>(
    initialEndDate,
  );

  const isDateValid = startDate !== null && endDate !== null;

  const isDateChanged =
    isDateValid &&
    !(
      startDate?.isSame(lastAppliedStartDate, 'day') &&
      endDate?.isSame(lastAppliedEndDate, 'day')
    );

  const handleApply = () => {
    if (isDateValid) {
      onDateChange(startDate, endDate);
      setLastAppliedStartDate(startDate);
      setLastAppliedEndDate(endDate);
    }
  };

  const handleReset = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    onDateChange(initialStartDate, initialEndDate);
    setLastAppliedStartDate(initialStartDate);
    setLastAppliedEndDate(initialEndDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container alignItems="center" spacing={2} minWidth="220px" mb={2}>
        <Grid container size={12} alignItems="center" spacing={1} mb={2}>
          <Typography variant="body1" color="primary">
            {'Выбранный диапазон: '}
          </Typography>
          <Typography variant="body2" color="primary">
            {initialStartDate?.format('DD.MM.YYYY')} -{' '}
            {initialEndDate?.format('DD.MM.YYYY')}
          </Typography>
        </Grid>

        <Grid display="flex">
          <DatePicker
            label="Начальная дата"
            value={startDate}
            format="DD.MM.YYYY"
            onChange={(newValue) => setStartDate(newValue)}
            minDate={dayjs().subtract(1, 'year')}
            maxDate={endDate || undefined}
            slotProps={{
              textField: {
                variant: 'outlined',
                sx: (theme) => ({
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.primary,
                  },
                }),
              },
            }}
          />
          <Tooltip title="Дата, начиная с которой будут отображаться данные">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid display="flex">
          <DatePicker
            label="Конечная дата"
            value={endDate}
            format="DD.MM.YYYY"
            onChange={(newValue) => setEndDate(newValue)}
            minDate={startDate || undefined}
            slotProps={{
              textField: {
                variant: 'outlined',
                sx: (theme) => ({
                  '& .MuiInputLabel-root': {
                    color: theme.palette.text.primary,
                  },
                }),
              },
            }}
          />
          <Tooltip title="Дата, до которой будут отображаться данные">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={!isDateValid || !isDateChanged}
            startIcon={<CheckIcon />}
          >
            Применить
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={
              startDate?.isSame(initialStartDate, 'day') &&
              endDate?.isSame(initialEndDate, 'day')
            }
            startIcon={<ReplayIcon />}
          >
            Сбросить
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
