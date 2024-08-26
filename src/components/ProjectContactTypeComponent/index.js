import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function ProjectContactTypeComponent(props) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            name="contact_is_customer"
            color="success"
            checked={props.values.contact_is_customer}
            onChange={(e) => {
              props.handleChange(e.target.checked);
            }}
          />
        }
        label="ลูกค้า (Customer)"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="contact_is_vendor"
            color="success"
            checked={props.values.contact_is_vendor}
            onChange={(e) => {
              props.handleChange(e.target.checked);
            }}
          />
        }
        label="ผู้ขาย (Vendor)"
      />
    </>
  );
}
