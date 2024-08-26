import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Radio,
  FormControlLabel,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ButtonComponent from "../../ButtonComponent";

export default function EngineerEditAmountComponent({
  showQuantity,
  itemQuantity,
  itemUnit,
  formik,
  name,
  type,
}) {
  const [open, setOpen] = useState(false);
  const [length] = useState(5.85);
  const [quantity, setQuantity] = useState(itemQuantity || 0);
  const [unit, setUnit] = useState(itemUnit || "เมตร");
  const [quantityLength, setQuantityLength] = useState(0);
  const [selectedValue, setSelectedValue] = useState("a");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedValue === "b") {
      formik.setFieldValue(`${name}.item_display_unit`, unit);
      if (type === "item_quantity") {
        formik.setFieldValue(`${name}.item_display_quantity`, quantityLength);
        formik.setFieldValue(`${name}.item_quantity`, quantity);
      } else {
        formik.setFieldValue(
          `${name}.item_display_reserved_quantity`,
          quantityLength
        );
        formik.setFieldValue(`${name}.item_reserved_quantity`, quantity);
      }
    } else {
      formik.setFieldValue(`${name}.item_display_unit`, itemUnit);
      if (type === "item_quantity") {
        formik.setFieldValue(`${name}.item_quantity`, quantity);
      } else {
        formik.setFieldValue(`${name}.item_reserved_quantity`, quantity);
      }
    }
    handleClose();
  };

  const allUnit = ["เมตร", "ตารางเมตร"];

  return (
    <Box>
      {showQuantity && itemQuantity}
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <EditOutlinedIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>จำนวน</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 150, alignSelf: "center" }}>
              จำนวน
            </DialogContentText>
            <div>
              <TextField
                sx={{
                  width: 80,
                }}
                autoComplete="off"
                size="small"
                margin="dense"
                type="number"
                inputProps={{ min: 0 }}
                id="name"
                value={quantity}
                onChange={(e) => {
                  setQuantity(parseFloat(e.target.value));
                  setQuantityLength(parseFloat(e.target.value) * length);
                }}
              />
            </div>
            <DialogContentText sx={{ alignSelf: "center" }}>
              แผ่น
            </DialogContentText>
          </Box>
          <FormControlLabel
            control={
              <Radio
                checked={selectedValue === "a"}
                onChange={handleChange}
                value="a"
                name="radio-buttons"
                inputProps={{ "aria-label": "A" }}
              />
            }
            label="ใช้หน่วยนี้"
            labelPlacement="end"
          />
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 150, alignSelf: "center" }}>
              ความยาว
            </DialogContentText>
            <DialogContentText
              sx={{ minWidth: 50, alignSelf: "center", p: "8.5px 14px" }}
            >
              {length}
            </DialogContentText>
            <DialogContentText sx={{ alignSelf: "center" }}>
              เมตร
            </DialogContentText>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <DialogContentText sx={{ minWidth: 150, alignSelf: "center" }}>
              จำนวน
            </DialogContentText>
            <TextField
              sx={{
                width: 80,
              }}
              autoComplete="off"
              size="small"
              margin="dense"
              type="number"
              inputProps={{ min: 0 }}
              id="name"
              value={quantityLength}
              onChange={(e) => setQuantityLength(parseFloat(e.target.value))}
            />
            <FormControl size="small" margin="dense" sx={{ minWidth: 80 }}>
              <InputLabel id="demo-simple-select-label">หน่วย</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={unit}
                label="หน่วย"
                onChange={(e) => handleUnitChange(e)}
              >
                {allUnit.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ButtonComponent
              variant="outlined"
              color="success"
              text="คำนวณ"
              sx={{ margin: "10px 0" }}
              size="small"
              onClick={() => {
                setQuantity(Math.ceil(quantityLength / length));
              }}
            />
          </Box>
          <FormControlLabel
            control={
              <Radio
                checked={selectedValue === "b"}
                onChange={handleChange}
                value="b"
                name="radio-buttons"
                inputProps={{ "aria-label": "B" }}
              />
            }
            label="ใช้หน่วยนี้"
            labelPlacement="end"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
