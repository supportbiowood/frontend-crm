import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
export default function AccountDateComponent({
  startDateLabel,
  endDateLabel,
  startDateValue,
  handleStartDateChange,
  startDateName,
  endDateValue,
  handleEndDateChange,
  endDateName,
  sentDateLabel,
  sentDateValue,
  handleSentDateChange,
  sentDateName,
  disabled,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {startDateLabel && (
        <DesktopDatePicker
          name={startDateName}
          disabled={disabled}
          label={startDateLabel}
          inputFormat="dd/MM/yyyy"
          value={startDateValue}
          onChange={handleStartDateChange}
          renderInput={(params) => (
            <TextField sx={{ width: 155 }} size="small" {...params} />
          )}
        />
      )}
      {endDateLabel && (
        <DesktopDatePicker
          name={endDateName}
          disabled={disabled}
          label={endDateLabel}
          inputFormat="dd/MM/yyyy"
          value={endDateValue}
          onChange={handleEndDateChange}
          renderInput={(params) => (
            <TextField sx={{ width: 155 }} size="small" {...params} />
          )}
        />
      )}
      {sentDateLabel && (
        <DesktopDatePicker
          name={sentDateName}
          disabled={disabled}
          label={sentDateLabel}
          inputFormat="dd/MM/yyyy"
          value={sentDateValue}
          onChange={handleSentDateChange}
          renderInput={(params) => (
            <TextField sx={{ width: 155 }} size="small" {...params} />
          )}
        />
      )}
    </LocalizationProvider>
  );
}
