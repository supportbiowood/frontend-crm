import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";

export default function SelectCustom({
  id,
  name,
  label,
  values,
  onChange,
  options,
  disabled,
  errors,
  helperText,
  sx,
}) {
  return (
    <FormControl size="small" fullWidth disabled={disabled} error={errors}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        id={id}
        name={name}
        value={values}
        label={label}
        onChange={onChange}
        sx={sx}
      >
        {options &&
          options.map((option) => {
            return <MenuItem value={option.id}>{option.name}</MenuItem>;
          })}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
