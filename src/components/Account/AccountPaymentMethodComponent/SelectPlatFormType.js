import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const allPlatformType = ["ผู้ให้บริการรับชำระ", "e-Commerce"];

const SelectPlatformType = ({ disabled, platform, label, name, formik }) => {
  return (
    <FormControl fullWidth size="small" margin="normal">
      <InputLabel disabled={disabled} id="demo-simple-select-label">
        {label}
      </InputLabel>
      <Select
        disabled={disabled}
        name={name}
        value={platform}
        label={label}
        onChange={formik.handleChange}
      >
        {allPlatformType.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default SelectPlatformType;
