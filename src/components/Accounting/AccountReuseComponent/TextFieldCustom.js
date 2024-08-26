import { TextField } from "@mui/material";
import React from "react";

export default function TextFieldCustom({
  id,
  name,
  label,
  values,
  onChange,
  disabled,
  multiline,
  rows,
  errors,
  helperText,
  sx,
  InputProps,
  inputProps,
}) {
  return (
    <TextField
      autoComplete="off"
      fullWidth
      label={label}
      size="small"
      sx={sx}
      InputProps={InputProps}
      inputProps={inputProps}
      value={values}
      onChange={onChange}
      disabled={disabled}
      id={id}
      name={name}
      multiline={multiline}
      rows={rows}
      error={errors}
      helperText={helperText}
    />
  );
}
