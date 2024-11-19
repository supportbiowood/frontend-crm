import { Autocomplete, TextField } from "@mui/material";
import React from "react";

export default function AutoCompleteCustom({
  id,
  name,
  label,
  value,
  onChange,
  options,
  disabled,
  errors,
  helperText,
  sx,
}) {
  return (
    <Autocomplete
      fullWidth
      disabled={disabled}
      size="small"
      sx={sx}
      value={value}
      onChange={onChange}
      id={id}
      name={name}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          error={errors}
          helperText={helperText}
          label={label}
          autoComplete="off"  // ย้าย autoComplete มาที่ TextField แทน
        />
      )}
    />
  );
}
