import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React from 'react'

export default function BarcodeComponent(props) {
  return (
    <div>
      <h3>ประเภทสินค้า</h3>
      <div style={{ margin: '15px 0' }}>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="gender" name="barcode" onChange={(e) => {
            if (e.target.value === '1') return props.setFieldValue('barcode', 1)
            props.setFieldValue('barcode', 2)
          }}
            defaultValue={1}
          >
            <FormControlLabel value={1} control={<Radio />} label="Barcode รหัสสินค้าภายใน" />
            <FormControlLabel value={2} control={<Radio />} label="Barcode รหัสสินค้าภายนอก" />
          </RadioGroup>
        </FormControl>
      </div>
      {props.values.barcode === 2 &&
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="text"
          name="barcode_description"
          id="outlined-error-helper-text"
          label="Barcode"
          value={props.values.barcode_description || ""}
          error={
            props.errors.barcode_description &&
            props.touched.barcode_description &&
            props.errors.barcode_description
          }
          helperText={
            props.errors.barcode_description &&
            props.touched.barcode_description &&
            props.errors.barcode_description
          }
        />
      }
    </div>
  )
}
