import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const SelectAccountType = ({
  disabled,
  accountType,
  handleAccountTypeChange,
}) => {
  const allAccountType = ["บัญชีกระแส", "บัญชีออมทรัพย์", "บัญชีประจำ"];
  return (
    <FormControl fullWidth size="small" margin="normal">
      <InputLabel disabled={disabled} id="demo-simple-select-label">
        ประเภทบัญชี
      </InputLabel>
      <Select
        disabled={disabled}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={accountType}
        label="ประเภทบัญชี"
        onChange={handleAccountTypeChange}
      >
        {allAccountType.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectAccountType;
