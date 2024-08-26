import React from 'react'
import { TextField, Checkbox, FormControl, InputLabel, Select, MenuItem, FormHelperText, Radio } from '@mui/material'
import { useField } from 'formik'
import InputAdornment from '@mui/material/InputAdornment'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export function FormikFullWidthInputTextComponent({ ...props }) {
  if (!props.error) {
    props.helperText = ''
  }
  return <TextField fullWidth size="small" variant="outlined"{...props} />
}

export function FormikInputSelectComponent({ ...props }) {
  return (
    <FormControl sx={props.style} fullWidth error={props.error} size="small">
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select{...props}>
        {props.menu.map((data, index) => (
          <MenuItem key={index} value={data.value}>
            {data.name} {data.selected}
          </MenuItem>
        ))}
      </Select>
      {props.error && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}

export function FormikInputTextAreaComponent({ ...props }) {
  if (!props.error) {
    props.helperText = ''
  }
  return <TextField style={{ width: '100%' }} size="small" variant="outlined" multiline {...props} />
}

export function FormikInputSelectComponentOnChange({ ...props }) {
  return (
    <FormControl sx={props.style} fullWidth error={props.error} size="small">
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select
        {...props}
        onChange={(e) => {
          props.setFieldValue(props.name, e.target.value, false)
          props.setState(e.target.value)
        }}
      >
        {props.menu.map((data, index) => (
          <MenuItem key={index} value={data.value}>
            {data.name}
          </MenuItem>
        ))}
      </Select>
      {props.error && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}

