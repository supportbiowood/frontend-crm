import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const EngineerDateComponent = ({
  name,
  disabled,
  label,
  value,
  dateChangeHandler,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        name={name}
        disabled={disabled}
        label={label}
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={dateChangeHandler}
        renderInput={(params) => (
          <TextField sx={{ width: 155 }} size="small" {...params} />
        )}
      />
    </LocalizationProvider>
  );
};

export default EngineerDateComponent;
