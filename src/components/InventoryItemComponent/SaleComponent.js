import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";

export default function SaleComponent(props) {
  const taxOption = [
    {
      name: "ไม่มี",
      value: "NONE",
    },
    {
      name: "0%",
      value: "ZERO",
    },
    {
      name: "7%",
      value: "SEVEN",
    },
  ];

  return (
    <div>
      <div className="grid-container-25">
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="number"
          name="saleUnitPrice"
          id="outlined-error-helper-text"
          label="ราคาขายต่อหน่วย"
          value={props.values.saleUnitPrice || ""}
          error={
            props.errors.saleUnitPrice &&
            props.touched.saleUnitPrice &&
            props.errors.saleUnitPrice
          }
          helperText={
            props.errors.saleUnitPrice &&
            props.touched.saleUnitPrice &&
            props.errors.saleUnitPrice
          }
        />
      </div>
      <div className="grid-container-25">
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="number"
          name="saleMaximumDiscount"
          id="outlined-error-helper-text"
          label="ส่วนลดสูงสุด"
          InputProps={{
            endAdornment: "%",
          }}
          value={props.values.saleMaximumDiscount || ""}
          error={
            props.errors.saleMaximumDiscount &&
            props.touched.saleMaximumDiscount &&
            props.errors.saleMaximumDiscount
          }
          helperText={
            props.errors.saleMaximumDiscount &&
            props.touched.saleMaximumDiscount &&
            props.errors.saleMaximumDiscount
          }
        />
      </div>
      <div className="grid-container-25">
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.taxType &&
            props.touched.taxType &&
            props.errors.taxType
          }
        >
          <InputLabel>ประเภทภาษี</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            label="ประเภทภาษี"
            name="taxType"
            id="demo-simple-select-error"
            value={props.values.taxType || ""}
          >
            {taxOption.map((tax, index) => (
              <MenuItem key={index} value={tax.value}>
                {tax.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.taxType &&
              props.touched.taxType &&
              props.errors.taxType}
          </FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
