import { TextField } from "@mui/material";
import React from "react";

export default function PurchaseComponent(props) {
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
          name="purchaseUnitPrice"
          id="outlined-error-helper-text"
          label="ราคาซื้อมาตราฐานต่อหน่วย"
          value={props.values.purchaseUnitPrice || ""}
          error={
            props.errors.purchaseUnitPrice &&
            props.touched.purchaseUnitPrice &&
            props.errors.purchaseUnitPrice
          }
          helperText={
            props.errors.purchaseUnitPrice &&
            props.touched.purchaseUnitPrice &&
            props.errors.purchaseUnitPrice
          }
        />
      </div>
      {/* <div className="grid-container-25">
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="text"
          name="preferredVendorID"
          id="outlined-error-helper-text"
          label="ผู้ขายหลัก"
          value={props.values.preferredVendorID || ""}
          error={
            props.errors.preferredVendorID &&
            props.touched.preferredVendorID &&
            props.errors.preferredVendorID
          }
          helperText={
            props.errors.preferredVendorID &&
            props.touched.preferredVendorID &&
            props.errors.preferredVendorID
          }
        />
      </div> */}
      <div className="grid-container-25">
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="number"
          name="purchaseMinOrderQty"
          id="outlined-error-helper-text"
          label="สั่งซื้อขั้นต่ำ"
          value={props.values.purchaseMinOrderQty || ""}
          error={
            props.errors.purchaseMinOrderQty &&
            props.touched.purchaseMinOrderQty &&
            props.errors.purchaseMinOrderQty
          }
          helperText={
            props.errors.purchaseMinOrderQty &&
            props.touched.purchaseMinOrderQty &&
            props.errors.purchaseMinOrderQty
          }
        />
      </div>
    </div>
  );
}
