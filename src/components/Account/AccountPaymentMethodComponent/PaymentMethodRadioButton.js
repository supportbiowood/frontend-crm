import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const PaymentMethodRadioButton = ({
  disabled,
  payment,
  handlePaymentChange,
}) => {
  return (
    <FormControl component="fieldset" disabled={disabled} fullWidth>
      <FormLabel
        sx={{
          "&, &.Mui-focused": {
            color: "black",
          },
        }}
        component="legend"
      >
        ประเภทช่องทางการเงิน
      </FormLabel>
      <RadioGroup
        row
        aria-label="type"
        name="row-radio-buttons-group"
        onChange={handlePaymentChange}
        value={payment}
      >
        <FormControlLabel
          value="cash"
          control={
            <Radio
              sx={{
                "&, &.Mui-checked": {
                  color: "#419644",
                },
              }}
              disableRipple
            />
          }
          label="เงินสด"
        />
        <FormControlLabel
          value="bank"
          control={
            <Radio
              sx={{
                "&, &.Mui-checked": {
                  color: "#419644",
                },
              }}
              disableRipple
            />
          }
          label="ธนาคาร"
        />
        <FormControlLabel
          value="e_wallet"
          control={
            <Radio
              sx={{
                "&, &.Mui-checked": {
                  color: "#419644",
                },
              }}
              disableRipple
            />
          }
          label="e-Wallet"
        />
        <FormControlLabel
          value="receiver"
          control={
            <Radio
              sx={{
                "&, &.Mui-checked": {
                  color: "#419644",
                },
              }}
              disableRipple
            />
          }
          label="สำรองรับ-จ่าย"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentMethodRadioButton;
