import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

const allBank = [
  "ธ.กรุงเทพ",
  "ธ.กสิกรไทย",
  "ธ.กรุงไทย",
  "ธ.ไทยพาณิชย์",
  "ธ.เกียรตินาคินภัทร",
  "ธ.ซีไอเอ็มบี",
  "ธ.ทีเอ็มบีธนชาต",
  "ธ.ทิสโก้",
  "ธ.ไทยเครดิต",
  "ธ.ธนชาต",
  "ธ.ธกส",
  "ธ.แลนด์ แอนด์ เฮ้าส์",
  "ธ.ออมสิน",
  "ธ.อื่นๆ",
];

const SelectBank = ({ disabled, bank, label, name, formik }) => {
  return (
    <FormControl fullWidth size="small" margin="normal">
      <InputLabel disabled={disabled} id="demo-simple-select-label">
        {label}
      </InputLabel>
      <Select
        disabled={disabled}
        name={name}
        value={bank}
        label={label}
        onChange={formik.handleChange}
      >
        {allBank.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectBank;
