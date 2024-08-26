import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const MovementFilter = ({ label, options, value, filterFunc }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        fullWidth
        size="small"
        id="demo-simple-select"
        label={label}
        value={value}
        onChange={filterFunc}
      >
        {options.map((option, i) => {
          return (
            <MenuItem value={option.value} key={i}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MovementFilter;
